// workers/transactionWorker.ts

let ws: WebSocket | null = null;
let reconnectTimer: any = null;
let lastWsUrl = "";

const MAJOR_PROTOCOLS = [
  "Jupiter", "Raydium", "Orca", "Tensor", "Magic Eden", "Pump.fun", "Meteora", "Marginfi",
  "Solend", "Kamino", "Drift", "Phoenix", "Parcl", "Zeta", "Mango", "Lifinity",
  "Token Program", "System Program", "Associated Token", "Compute Budget",
  "Whirlpool", "Francium", "Sababer", "Pyth Network", "Wormhole", "Bridges",
  "OpenBook", "Serum", "Atrix", "Saber", "Quarry", "Sunny", "Tulip", "Larix"
];
const TX_TYPES = ["Swap", "Mint", "Transfer"] as const;

let globalId = 0;
let filterMode = "smart";

let txCount = 0;
let protocolVolume: Record<string, number> = {};
let activeProtocols = new Map<string, { lastSeen: number; volume: number }>(); 
let whaleTimes: Array<{ time: number; value: number; direction: "in" | "out" }> = [];
let whaleBuffer: any[] = [];

MAJOR_PROTOCOLS.forEach(p => protocolVolume[p] = 0);

// Helper to pseudo-randomly generate a realistic transaction
function parseLiveLog(log: any) {
  if (!log.params || !log.params.result) return null;
  const signature = log.params.result.value.signature as string;
  if (!signature) return null;

  globalId++;
  let sigNumber = 0;
  for (let i = 0; i < signature.length; i += 4) {
    sigNumber += signature.charCodeAt(i);
  }
  
  const isWhale = (signature.charCodeAt(1) % 20) === 0;
  const noiseThreshold = filterMode === "all" ? 15 : 5;
  const isNoise = (sigNumber % noiseThreshold !== 0);

  if (filterMode === "smart" && isNoise) return null;

  let rawValue = 0;
  if (isWhale) {
     rawValue = Math.floor(Math.random() * 1200000) + 10000;
  } else if (isNoise) {
     rawValue = (Math.random() * 0.99) + 0.001; 
  } else {
     rawValue = Math.floor(Math.random() * 300) + 1; 
  }

  let severity: "mega" | "large" | "normal" = "normal";
  if (rawValue > 500000) severity = "mega";
  else if (rawValue > 100000) severity = "large";

  const formatter = new Intl.NumberFormat("en-US", { 
      style: "currency", 
      currency: "USD", 
      maximumFractionDigits: isNoise ? 3 : 0 
  });
  const formattedValue = formatter.format(rawValue);
  const type = TX_TYPES[sigNumber % TX_TYPES.length];
  
  let protocol = "";
  const varietySeed = sigNumber % 100;
  if (varietySeed < 70) {
    protocol = MAJOR_PROTOCOLS[sigNumber % MAJOR_PROTOCOLS.length];
  } else {
    protocol = `Program-${signature.substring(0, 4)}...`;
  }

  const direction: "in" | "out" = (sigNumber % 2 === 0) ? "in" : "out";
  let description = "";
  if (type === "Swap") description = `User swapped tokens on ${protocol}`;
  if (type === "Mint") description = `NFT Mint on ${protocol}`;
  if (type === "Transfer") description = `Transfer to ${signature.substring(0, 4)}...`;

  const tx = {
    type,
    protocol,
    description,
    direction,
    valueNum: rawValue,
    value: formattedValue,
    address: `${signature.substring(0, 4)}...${signature.slice(-4)}`,
    time: "Just now",
    rawSignature: signature,
    id: `ws-${globalId}`,
    severity,
  };

  return { tx, isWhale };
}

function initConnection(wsUrl: string) {
  if (!wsUrl) return;
  lastWsUrl = wsUrl;
  
  if (ws) {
    ws.onclose = null;
    ws.close();
  }

  console.log("[Worker] Connecting to WebSocket...");
  ws = new WebSocket(wsUrl);

  let lastSlotSeen = 0;
  let lastSlotTimestamp = Date.now();

  ws.onopen = () => {
    console.log("[Worker] WebSocket Connected to Helius");
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "logsSubscribe",
        params: ["all"], 
      }));
    }
  };

  ws.onmessage = (e: MessageEvent) => {
    txCount++; 
    try {
      const data = JSON.parse(e.data);
      const currentSlot = data.params?.result?.context?.slot;
      
      if (currentSlot && currentSlot > lastSlotSeen) {
        const now = Date.now();
        const delta = now - lastSlotTimestamp;
        lastSlotSeen = currentSlot;
        lastSlotTimestamp = now;

        // Always broadcast the slot arrival
        // Use delta only for the ms display, with a sane fallback (Solana target ~400ms)
        const slotTimeMs = (delta > 50 && delta < 5000) 
          ? Math.min(delta, 1000) 
          : 400;

        self.postMessage({ 
          type: "SLOT_UPDATE", 
          slot: currentSlot,
          slotTimeMs
        });
      }

      const parsed = parseLiveLog(data);
      if (!parsed) return;

      const { tx, isWhale } = parsed;

      if (tx.valueNum > 10) {
        const prev = activeProtocols.get(tx.protocol);
        activeProtocols.set(tx.protocol, {
          lastSeen: Date.now(),
          volume: (prev?.volume || 0) + tx.valueNum
        });
      }

      if (protocolVolume[tx.protocol] !== undefined) {
          protocolVolume[tx.protocol] += tx.valueNum;
      }

      if (tx.valueNum > 0) {
        if (isWhale) {
          whaleTimes.push({ time: Date.now(), value: tx.valueNum, direction: tx.direction });
          whaleBuffer.push(tx);
        } else {
          self.postMessage({ type: "NEW_TRANSACTION", tx });
        }
      }
    } catch (err) {
      // Ignore
    }
  };

  ws.onerror = () => {
    console.error("[Worker] WebSocket Error");
  };

  ws.onclose = () => {
    console.log("[Worker] WebSocket Disconnected. Retrying autonomously...");
    ws = null;
    if (!reconnectTimer && lastWsUrl) {
      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        initConnection(lastWsUrl);
      }, 3000);
    }
  };
}

// Global Broadcasters (Started once)
setInterval(() => {
  const now = Date.now();
  whaleTimes = whaleTimes.filter(t => now - t.time < 60000);

  let totalActiveVolume = 0;
  for (const [name, stats] of activeProtocols.entries()) {
    if (now - stats.lastSeen > 15000) {
      activeProtocols.delete(name);
    } else {
      totalActiveVolume += stats.volume;
    }
  }

  const topProtocols = [...activeProtocols.entries()]
    .sort((a, b) => b[1].volume - a[1].volume)
    .slice(0, 3)
    .map(([name, stats]) => {
      const initials = name.split(" ").map(word => word[0]).join("").substring(0, 2).toUpperCase();
      return {
        name,
        initials,
        volume: stats.volume,
        share: totalActiveVolume > 0 ? (stats.volume / totalActiveVolume) * 100 : 0
      };
    });

  const volumeIn = whaleTimes.filter(t => t.direction === "in").reduce((sum, t) => sum + t.value, 0);
  const volumeOut = whaleTimes.filter(t => t.direction === "out").reduce((sum, t) => sum + t.value, 0);

  self.postMessage({ 
    type: "METRICS_UPDATE", 
    payload: {
      tps: txCount,
      whaleCount: whaleTimes.length,
      whaleVolumeIn: volumeIn,
      whaleVolumeOut: volumeOut,
      whaleVolumeTotal: volumeIn + volumeOut,
      activeCount: activeProtocols.size,
      topProtocols,
      lastWhaleTime: whaleTimes.length > 0 ? whaleTimes[whaleTimes.length - 1].time : null
    } 
  });
  txCount = 0;
}, 1000);

setInterval(() => {
  if (whaleBuffer.length === 0) return;
  const bestWhale = whaleBuffer.reduce((prev, current) => (prev.valueNum > current.valueNum) ? prev : current);
  self.postMessage({ type: "WHALE_ALERT", tx: bestWhale });
  whaleBuffer = [];
}, 5000);

setInterval(() => {
  self.postMessage({ type: "PROTOCOL_VOLUME", payload: protocolVolume });
}, 2000);

self.onmessage = (event) => {
  const { type, payload } = event.data;

  if (type === "INIT") {
    if (ws) return;
    if (payload.initialFilter) filterMode = payload.initialFilter;
    initConnection(payload.wsUrl);
  }

  if (type === "CHECK_CONNECTION") {
    if (!ws || ws.readyState === WebSocket.CLOSED || ws.readyState === WebSocket.CLOSING) {
      console.log("[Worker] Heartbeat recovery: Reconnecting...");
      initConnection(lastWsUrl);
    }
  }

  if (type === "SET_FILTER") {
    filterMode = payload;
  }

  if (type === "DISCONNECT") {
    if (ws) {
      ws.onclose = null;
      ws.close();
      ws = null;
    }
  }
};
