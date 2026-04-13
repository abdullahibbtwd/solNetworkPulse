"use client";

import React, { useEffect, useRef, useState, memo, useCallback, useMemo } from "react";
import { TableVirtuoso } from "react-virtuoso";
import { createChart, CandlestickSeries } from "lightweight-charts";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  ChartNoAxesCombined,
  CircleAlert,
  Compass,
  Flame,
  Pause,
  Siren,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { AnalyticsView } from "@/components/analytics/analytics-view";
import { EcosystemView } from "@/components/ecosystem/ecosystem-view";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
type ProtocolRow = {
  name: string;
  activity: number;
  value: string;
  color: string;
};

type Transaction = {
  id: string | undefined;
  type: "Swap" | "Mint" | "Transfer";
  protocol: string;
  description: string;
  value: string;
  address: string;
  time: string;
  rawSignature?: string;
  severity?: "mega" | "large" | "normal";
};

/* ─────────────────────────────────────────────
   Static data (Initial mock fallback)
───────────────────────────────────────────── */
const protocolRows: ProtocolRow[] = [
  { name: "Jupiter", activity: 42, value: "$840M", color: "#9945ff" },
  { name: "Raydium", activity: 28, value: "$560M", color: "#00ec91" },
  { name: "Orca", activity: 15, value: "$300M", color: "#9945ff" },
  { name: "Tensor", activity: 10, value: "$200M", color: "#00ec91" },
  { name: "Magic Eden", activity: 5, value: "$100M", color: "#9945ff" },
];

const initialTransactions: Transaction[] = [
  { id: "mock-1", type: "Swap", protocol: "Jupiter", description: "User swapped 500 SOL for USDC", value: "$71,320.00", address: "7xR...9wL", time: "Just now" },
  { id: "mock-2", type: "Mint", protocol: "Tensor", description: "Mad Lads #4202 Minted", value: "$22,450.00", address: "H4p...K3S", time: "12s ago" },
  { id: "mock-3", type: "Transfer", protocol: "Native", description: "Transfer of 1,200 SOL to Binance", value: "$171,168.00", address: "Bin...001", time: "45s ago" },
  { id: "mock-4", type: "Swap", protocol: "Raydium", description: "Swapped 15.4M $BONK for SOL", value: "$1,450.00", address: "Dge...666", time: "1m ago" },
];

const solCandles = [
  { time: "2024-03-01" as const, open: 112.4, high: 118.2, low: 110.1, close: 116.8 },
  { time: "2024-03-02" as const, open: 116.8, high: 121.5, low: 114.3, close: 119.2 },
  { time: "2024-03-03" as const, open: 119.2, high: 122.0, low: 115.6, close: 117.4 },
  { time: "2024-03-04" as const, open: 117.4, high: 124.8, low: 116.0, close: 123.5 },
  { time: "2024-03-05" as const, open: 123.5, high: 131.2, low: 121.0, close: 129.6 },
  { time: "2024-03-06" as const, open: 129.6, high: 133.4, low: 126.1, close: 128.3 },
  { time: "2024-03-07" as const, open: 128.3, high: 130.0, low: 122.5, close: 124.1 },
  { time: "2024-03-08" as const, open: 124.1, high: 128.7, low: 119.8, close: 127.0 },
  { time: "2024-03-09" as const, open: 127.0, high: 136.5, low: 125.3, close: 134.8 },
  { time: "2024-03-10" as const, open: 134.8, high: 140.2, low: 132.0, close: 138.5 },
  { time: "2024-03-11" as const, open: 138.5, high: 143.6, low: 135.4, close: 141.2 },
  { time: "2024-03-12" as const, open: 141.2, high: 148.9, low: 139.0, close: 146.3 },
  { time: "2024-03-13" as const, open: 146.3, high: 150.1, low: 140.5, close: 143.7 },
  { time: "2024-03-14" as const, open: 143.7, high: 147.2, low: 138.8, close: 140.9 },
  { time: "2024-03-15" as const, open: 140.9, high: 145.5, low: 139.2, close: 142.64 },
];

/* ─────────────────────────────────────────────
   Hooks
───────────────────────────────────────────── */
function useSmoothNumber(value: number, duration = 400) {
  const [display, setDisplay] = useState(value);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;

  useEffect(() => {
    // Skip animation on mobile — just snap to value to save CPU/GPU cycles
    if (isMobile) {
      setDisplay(value);
      return;
    }

    let startValue = display;
    let startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Linear interpolation
      const nextValue = startValue + (value - startValue) * progress;
      setDisplay(Math.round(nextValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    const frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value, isMobile]);

  return display;
}

/* ─────────────────────────────────────────────
   Metric card shared top row
───────────────────────────────────────────── */
function CardTopRow({ label, icon, iconColor }: { label: string; icon: React.ReactNode; iconColor: string }) {
  return (
    <div className="flex items-center justify-between">
      <p className="font-heading text-[10px] font-semibold tracking-[0.12em] uppercase" style={{ color: "#9ea0aa" }}>
        {label}
      </p>
      <span className="flex size-7 items-center justify-center rounded-lg" style={{ background: "rgba(158,160,170,0.07)", color: iconColor }}>
        {icon}
      </span>
    </div>
  );
}

const CardTPS = memo(({ tps }: { tps: number }) => {
  const smoothTPS = useSmoothNumber(tps, 400);
  const [maxTPS, setMaxTPS] = useState(5000);

  useEffect(() => {
    if (tps > maxTPS) setMaxTPS(tps);
  }, [tps]);

  const percentage = Math.min(100, (smoothTPS / maxTPS) * 100);

  return (
    <GlassCard>
      <div className="flex flex-col gap-3 p-5">
        <CardTopRow label="Transactions per sec" icon={<Zap className="size-4" />} iconColor="#00ec91" />

        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <p className="font-heading text-5xl font-bold leading-none tabular-nums" style={{ color: "#ebecf0" }}>
              {smoothTPS.toLocaleString()}
            </p>
            <span className="font-heading text-xs font-semibold" style={{ color: "#00ec91" }}>Live</span>
          </div>
          <span className="font-heading text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#9ea0aa" }}>
            Peak: {maxTPS.toLocaleString()}
          </span>
        </div>

        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${percentage}%`,
              background: "linear-gradient(90deg, #00ec91, #14f195, #9945ff)",
              boxShadow: smoothTPS > 4000 ? "0 0 12px rgba(0, 236, 145, 0.3)" : "none"
            }}
          />
        </div>
      </div>
    </GlassCard>
  );
});
CardTPS.displayName = "CardTPS";

function CardActivePrograms({ count, topProtocols = [] }: {
  count: number;
  topProtocols?: Array<{ initials: string; share: number; name: string }>
}) {
  return (
    <GlassCard>
      <div className="flex flex-col gap-3 p-5">
        <CardTopRow label="Protocol Activity" icon={<ChartNoAxesCombined className="size-4" />} iconColor="#9945ff" />
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <p className="font-heading text-5xl font-bold leading-none tabular-nums" style={{ color: "#ebecf0" }}>{count}</p>
            <span className="font-heading text-xs font-semibold" style={{ color: "#00ec91" }}>Active</span>
          </div>
          {topProtocols.length > 0 && (
            <p className="font-heading text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#9ea0aa" }}>
              <span style={{ color: "#9945ff" }}>{topProtocols[0].name}</span> Dominance: {topProtocols[0].share.toFixed(0)}%
            </p>
          )}
        </div>

        <div className="mt-1 flex items-center">
          {topProtocols.map((p, i) => (
            <span
              key={p.name}
              className="flex size-6 items-center justify-center rounded-full font-heading text-[9px] font-bold"
              style={{
                background: "#1e1f25",
                color: i === 0 ? "#ebecf0" : "#9ea0aa",
                outline: `1.5px solid ${i === 0 ? "rgba(153,69,255,0.4)" : "rgba(158,160,170,0.18)"}`,
                marginLeft: i === 0 ? 0 : "-6px",
                zIndex: topProtocols.length - i,
                position: "relative"
              }}
              title={p.name}
            >
              {p.initials}
            </span>
          ))}
          {count > 3 && (
            <span
              className="flex h-6 items-center rounded-full px-2 font-heading text-[9px] font-bold"
              style={{ background: "#1e1f25", color: "#9ea0aa", outline: "1.5px solid rgba(158,160,170,0.18)", marginLeft: "-6px", position: "relative", zIndex: 0 }}
            >
              +{count - topProtocols.length}
            </span>
          )}
        </div>
      </div>
    </GlassCard>
  );
}

function getWhaleLabel(lastWhaleTime: number | null, count: number): string {
  if (!lastWhaleTime || count === 0) return "Scanning";
  const seconds = Math.floor((Date.now() - lastWhaleTime) / 1000);
  if (seconds < 5) return "Just Now";
  if (seconds < 60) return `${seconds}s ago`;
  return "Last 1m";
}

function CardWhaleAlerts({ count, lastWhaleTime, volumeIn, volumeOut, totalVolume }: {
  count: number;
  lastWhaleTime: number | null;
  volumeIn: number;
  volumeOut: number;
  totalVolume: number;
}) {
  // Derive label on render — the parent wrapper flushes every 2s on mobile anyway
  const label = getWhaleLabel(lastWhaleTime, count);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1
  });

  return (
    <GlassCard>
      <div className="flex flex-col gap-3 p-5">
        <CardTopRow label="Whale Volume (60s)" icon={<AlertTriangle className="size-4" />} iconColor="#de3337" />
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <p className="font-heading text-4xl font-bold leading-none tabular-nums" style={{ color: "#ebecf0" }}>
              {formatter.format(totalVolume)}
            </p>
            <span className="font-heading text-xs font-semibold" style={{ color: count > 0 ? "#00ec91" : "#9ea0aa" }}>{label}</span>
          </div>
          <p className="font-heading text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#9ea0aa" }}>
            {count} whale signals detected
          </p>
        </div>

        <div className="mt-1 flex items-center justify-between border-t border-white/5 pt-3">
          <div className="flex flex-col">
            <span className="font-heading text-[9px] font-bold uppercase tracking-widest" style={{ color: "#9ea0aa" }}>Inflow</span>
            <span className="font-heading text-xs font-bold" style={{ color: "#00ec91" }}>{formatter.format(volumeIn)}</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="font-heading text-[9px] font-bold uppercase tracking-widest" style={{ color: "#9ea0aa" }}>Outflow</span>
            <span className="font-heading text-xs font-bold" style={{ color: "#de3337" }}>{formatter.format(volumeOut)}</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

// ── PERFORMANCE: Individual Subscriber Wrappers ──
// Each card manages its own buffer + flush to isolate re-renders.

const CardTPSWrapper = memo(({ worker }: { worker: Worker | null }) => {
  const [tps, setTps] = useState(0);
  const bufferRef = useRef(0);

  useEffect(() => {
    if (!worker) return;
    const handler = (e: MessageEvent) => {
      if (e.data.type === "METRICS_UPDATE") bufferRef.current = e.data.payload.tps;
    };
    worker.addEventListener("message", handler);
    const isMobile = window.innerWidth < 1024;
    const pulsar = setInterval(() => setTps(bufferRef.current), isMobile ? 1500 : 800);
    return () => { worker.removeEventListener("message", handler); clearInterval(pulsar); };
  }, [worker]);

  return <CardTPS tps={tps} />;
});

const CardSlotWrapper = memo(({ worker }: { worker: Worker | null }) => {
  const slotTimeRef = useRef(0);
  const windowBufferRef = useRef<number[]>([]);
  const [display, setDisplay] = useState({
    slotTime: 0,
    bars: [0, 0, 0, 0, 0, 0, 0] as number[],
  });

  useEffect(() => {
    if (!worker) return;

    const handler = (e: MessageEvent) => {
      if (e.data.type !== "SLOT_UPDATE") return;
      const ms = e.data.slotTimeMs || 400;

      const isMobile = window.innerWidth < 1024;
      const alpha = isMobile ? 0.35 : 0.25; // Faster response on mobile pulsars

      slotTimeRef.current = slotTimeRef.current + alpha * (ms - slotTimeRef.current);
      windowBufferRef.current.push(ms);
    };

    worker.addEventListener("message", handler);

    const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
    const pulsar = setInterval(() => {
      setDisplay(prev => {
        const smoothed = Math.round(slotTimeRef.current);

        // Calculate the average of this window to ensure bars match the number's signal
        const windowData = windowBufferRef.current;
        const windowAvg = windowData.length > 0
          ? windowData.reduce((a, b) => a + b, 0) / windowData.length
          : slotTimeRef.current;

        windowBufferRef.current = []; // Reset for next window

        const newBars = [...prev.bars.slice(-6), windowAvg];
        return { slotTime: smoothed, bars: newBars };
      });
    }, isMobile ? 1200 : 800); // Slightly faster mobile pulsar

    return () => {
      worker.removeEventListener("message", handler);
      clearInterval(pulsar);
    };
  }, [worker]);

  const status =
    display.slotTime < 420 ? { label: "Fast", color: "#00ec91" } :
      display.slotTime < 480 ? { label: "Normal", color: "#facc15" } :
        { label: "Congested", color: "#ef4444" };

  return (
    <GlassCard>
      <div className="flex flex-col gap-3 p-5">
        <CardTopRow label="Slot Time" icon={<Activity className="size-4" />} iconColor="#9945ff" />
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <p className="font-heading text-5xl font-bold leading-none tabular-nums" style={{ color: "#ebecf0" }}>
              {display.slotTime}
            </p>
            <span className="font-heading text-lg font-medium" style={{ color: "#9ea0aa" }}>ms</span>
            <span className="font-heading text-xs font-semibold uppercase" style={{ color: status.color }}>
              {status.label}
            </span>
          </div>
        </div>
        <div className="flex items-end gap-[3px] h-[18px]">
          {display.bars.map((h, i) => {
            const normalized = Math.min(100, Math.max(5, ((h - 350) / (500 - 350)) * 100));
            return (
              <div
                key={i}
                className="w-2 rounded-sm transition-all duration-500"
                style={{
                  height: `${normalized}%`,
                  background: `rgba(153,69,255,${0.3 + normalized / 100})`,
                }}
              />
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
});
CardSlotWrapper.displayName = "CardSlotWrapper";

const CardProtocolWrapper = memo(({ worker }: { worker: Worker | null }) => {
  const [data, setData] = useState({ activeCount: 0, topProtocols: [] as any[] });
  const bufferRef = useRef(data);

  useEffect(() => {
    if (!worker) return;
    const handler = (e: MessageEvent) => {
      if (e.data.type === "METRICS_UPDATE") {
        bufferRef.current = {
          activeCount: e.data.payload.activeCount,
          topProtocols: e.data.payload.topProtocols,
        };
      }
    };
    worker.addEventListener("message", handler);
    const isMobile = window.innerWidth < 1024;
    const pulsar = setInterval(() => setData({ ...bufferRef.current }), isMobile ? 2000 : 800);
    return () => { worker.removeEventListener("message", handler); clearInterval(pulsar); };
  }, [worker]);

  return <CardActivePrograms count={data.activeCount} topProtocols={data.topProtocols} />;
});

const CardWhaleWrapper = memo(({ worker }: { worker: Worker | null }) => {
  const [data, setData] = useState({
    whaleCount: 0, lastWhaleTime: null as number | null,
    whaleVolumeIn: 0, whaleVolumeOut: 0, whaleVolumeTotal: 0,
  });
  const bufferRef = useRef(data);

  useEffect(() => {
    if (!worker) return;
    const handler = (e: MessageEvent) => {
      if (e.data.type === "METRICS_UPDATE") {
        const p = e.data.payload;
        bufferRef.current = {
          whaleCount: p.whaleCount,
          lastWhaleTime: p.lastWhaleTime,
          whaleVolumeIn: p.whaleVolumeIn,
          whaleVolumeOut: p.whaleVolumeOut,
          whaleVolumeTotal: p.whaleVolumeTotal,
        };
      }
    };
    worker.addEventListener("message", handler);
    const isMobile = window.innerWidth < 1024;
    const pulsar = setInterval(() => setData({ ...bufferRef.current }), isMobile ? 2000 : 800);
    return () => { worker.removeEventListener("message", handler); clearInterval(pulsar); };
  }, [worker]);

  return (
    <CardWhaleAlerts
      count={data.whaleCount}
      lastWhaleTime={data.lastWhaleTime}
      volumeIn={data.whaleVolumeIn}
      volumeOut={data.whaleVolumeOut}
      totalVolume={data.whaleVolumeTotal}
    />
  );
});

export const MetricsRow = memo(({ worker }: { worker: Worker | null }) => (
  <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <CardTPSWrapper worker={worker} />
    <CardSlotWrapper worker={worker} />
    <CardProtocolWrapper worker={worker} />
    <CardWhaleWrapper worker={worker} />
  </section>
));
MetricsRow.displayName = "MetricsRow";

/* ─────────────────────────────────────────────
   Market Chart
───────────────────────────────────────────── */
const MarketChart = memo(() => {
  const timeSlots = ["1M", "5M", "1H", "4H"];
  const [activeSlot, setActiveSlot] = useState("1M");
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [liveChange, setLiveChange] = useState<number | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const candleSeriesRef = useRef<any>(null);
  const lastCandleRef = useRef<any>(null);

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    const chart = createChart(container, {
      width: container.clientWidth,
      height: 260,
      layout: { background: { color: "#121318" }, textColor: "#9ea0aa", fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, attributionLogo: false },
      grid: { vertLines: { visible: false }, horzLines: { color: "rgba(158,160,170,0.06)" } },
      crosshair: { vertLine: { color: "rgba(153,69,255,0.35)", width: 1, style: 3 }, horzLine: { color: "rgba(153,69,255,0.35)", width: 1, style: 3 } },
      rightPriceScale: { borderColor: "rgba(158,160,170,0.08)", textColor: "#9ea0aa" },
      timeScale: { borderColor: "rgba(158,160,170,0.08)", timeVisible: true, secondsVisible: false },
      handleScroll: true,
      handleScale: true,
    });

    const candleSeries = chart.addSeries(CandlestickSeries, { upColor: "#00ec91", downColor: "#de3337", borderUpColor: "#00ec91", borderDownColor: "#de3337", wickUpColor: "rgba(0,236,145,0.6)", wickDownColor: "rgba(222,51,55,0.6)" });
    candleSeriesRef.current = candleSeries;

    let isDisposed = false;

    const ro = new ResizeObserver(() => {
      if (!isDisposed && container.clientWidth > 0) {
        try {
          chart.applyOptions({ width: container.clientWidth });
        } catch (e) { }
      }
    });
    ro.observe(container);

    // Fetch live OHLC from CoinGecko
    const fetchOHLC = () => {
      if (isDisposed) return;
      fetch("https://api.coingecko.com/api/v3/coins/solana/ohlc?vs_currency=usd&days=1")
        .then(res => res.json())
        .then((data: [number, number, number, number, number][]) => {
          if (isDisposed || !data || !Array.isArray(data)) return;
          const formatted = data.map(d => ({
            time: (Math.floor(d[0] / 1000)) as any,
            open: d[1],
            high: d[2],
            low: d[3],
            close: d[4]
          })).sort((a, b) => a.time - b.time);

          const unique = Array.from(new Map(formatted.map(item => [item.time, item])).values());
          candleSeries.setData(unique);
          chart.timeScale().fitContent();

          if (unique.length > 0) {
            lastCandleRef.current = { ...unique[unique.length - 1] };
          }
        })
        .catch((err) => {
          if (isDisposed) return;
          console.warn("CoinGecko OHLC API rate limited, using fallback");
          candleSeries.setData(solCandles);
          lastCandleRef.current = { ...solCandles[solCandles.length - 1] };
        });
    };

    // Fetch instantaneous live ticker price
    const fetchLivePrice = () => {
      if (isDisposed) return;
      try {
        fetch("/api/price")
          .then(res => res.json())
          .then(data => {
            if (isDisposed || !data?.price) return;
            const price = data.price;
            setLivePrice(price);
            if (data.change24h) setLiveChange(data.change24h);

            if (candleSeriesRef.current && lastCandleRef.current) {
              const last = lastCandleRef.current;
              last.close = price;
              if (price > last.high) last.high = price;
              if (price < last.low) last.low = price;
              candleSeriesRef.current.update(last);
            }
          })
          .catch(() => { /* Silence transient local fetch errors */ });
      } catch (e) {
        /* Silence synchronous fetch errors */
      }
    };

    fetchOHLC();
    fetchLivePrice();

    const ohlcInterval = setInterval(fetchOHLC, 60000);
    const priceInterval = setInterval(fetchLivePrice, 15000);

    return () => {
      isDisposed = true;
      ro.disconnect();
      try {
        chart.remove();
      } catch (e) { }
      clearInterval(ohlcInterval);
      clearInterval(priceInterval);
    };
  }, []);

  return (
    <GlassCard className="h-full">
      <div className="flex flex-col gap-4 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-heading text-[10px] font-semibold tracking-[0.12em] uppercase flex items-center gap-1" style={{ color: "#9ea0aa" }}>
              SOL / USD {livePrice && <span style={{ color: "#00ec91" }}>• LIVE</span>}
            </p>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="font-heading text-3xl font-bold tabular-nums leading-none sm:text-4xl" style={{ color: "#ebecf0" }}>
                {livePrice ? `$${livePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$142.64"}
              </span>
              <span className="font-heading text-sm font-semibold" style={{ color: (liveChange || 0) >= 0 ? "#00ec91" : "#de3337" }}>
                {(liveChange || 0) >= 0 ? "+" : ""}{(liveChange || 0).toFixed(2)}%
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {timeSlots.map((slot) => (
              <button key={slot} onClick={() => setActiveSlot(slot)} className="rounded-lg px-2 py-1 font-heading text-xs font-semibold transition-all hover:bg-white/5 sm:px-2.5" style={slot === activeSlot ? { background: "rgba(153,69,255,0.15)", color: "#9945ff" } : { color: "#9ea0aa" }}>{slot}</button>
            ))}
            <button id="btn-chart-expand" className="ml-1 flex size-7 items-center justify-center rounded-lg transition-all hover:bg-white/5" style={{ color: "#9ea0aa" }}>
              <TrendingUp className="size-4" />
            </button>
          </div>
        </div>
        <div ref={chartContainerRef} className="w-full overflow-hidden rounded-xl" style={{ background: "#121318" }} />
      </div>
    </GlassCard>
  );
});
MarketChart.displayName = "MarketChart";

/* ─────────────────────────────────────────────
   Protocol Activity
───────────────────────────────────────────── */
const ProtocolActivity = memo(({ worker }: { worker: Worker | null }) => {
  const [volumes, setProtocolVolumes] = useState<Record<string, number>>({});
  const [tpsHistory, setTpsHistory] = useState<number[]>([2450, 2450, 2450, 2450, 2450, 2450, 2450]);

  useEffect(() => {
    if (!worker) return;

    const handleMessage = (e: MessageEvent) => {
      const { type, payload } = e.data;
      if (type === "PROTOCOL_VOLUME") {
        setProtocolVolumes(payload);
      } else if (type === "METRICS_UPDATE") {
        setTpsHistory(prev => {
          const next = [...prev, payload.tps];
          if (next.length > 7) next.shift();
          return next;
        });
      }
    };

    worker.addEventListener("message", handleMessage);
    return () => worker.removeEventListener("message", handleMessage);
  }, [worker]);

  const totalVol = Object.values(volumes).reduce((a, b) => a + b, 0) || 1;
  const sorted = Object.entries(volumes)
    .sort((a, b) => b[1] - a[1]) // highest first
    .map(([name, val]) => ({
      name,
      activity: Math.round((val / totalVol) * 100) || 0,
      value: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 }).format(val),
      color: "#9945ff"
    })).filter(x => x.activity > 0);

  const displayRows = sorted.length > 0 ? sorted : protocolRows;

  // Congestion Logic
  const currentTps = tpsHistory[tpsHistory.length - 1] || 0;
  let status = "LOW";
  let statusColor = "#00ec91";

  if (currentTps > 6500) {
    status = "HIGH";
    statusColor = "#de3337"; // red
  } else if (currentTps > 4500) {
    status = "MED";
    statusColor = "#eab308"; // yellow
  }

  // Ensure we always map exactly 7 blocks
  const blocks = tpsHistory.length === 7 ? tpsHistory : [0, 0, 0, 0, 0, 0, 0];

  return (
    <GlassCard className="h-full">
      <div className="flex flex-col gap-5 p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <p className="font-heading text-xl font-semibold" style={{ color: "#ebecf0" }}>Protocol Activity</p>
          <span className="flex items-center gap-1 font-heading text-[10px] font-semibold tracking-[0.1em] uppercase" style={{ color: sorted.length > 0 ? "#00ec91" : "#9ea0aa" }}>
            {sorted.length > 0 && <span className="relative flex size-1.5"><span className="absolute inline-flex size-full animate-ping rounded-full opacity-75" style={{ background: "#00ec91" }}></span><span className="relative inline-flex size-1.5 rounded-full" style={{ background: "#00ec91" }}></span></span>}
            {sorted.length > 0 ? "LIVE ACCUMULATION" : "Volume Heatmap"}
          </span>
        </div>
        <div className="flex flex-col gap-4">
          {displayRows.slice(0, 5).map((row) => (
            <div key={row.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-sans text-sm font-medium" style={{ color: "#ebecf0" }}>{row.name}</span>
                <span className="font-heading text-xs font-semibold tabular-nums" style={{ color: "#00ec91" }}>{row.activity}% • {row.value}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full" style={{ background: "rgba(0,0,0,0.35)" }}>
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${row.activity}%`, background: "linear-gradient(90deg, #9945ff, #00ec91)" }} />
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="font-heading text-[10px] font-semibold tracking-[0.1em] uppercase" style={{ color: "#9ea0aa" }}>Network Congestion</p>
            <span className="font-heading text-[10px] font-semibold tracking-[0.08em] uppercase transition-colors duration-500" style={{ color: statusColor }}>{status}</span>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {blocks.map((v, i) => {
              // Map realistic TPS values (0 to ~8000) into a visual opacity between 0.1 and 1.0
              const intensity = Math.max(0.10, Math.min(1.0, v / 7500));
              return (
                <div key={i} className="aspect-square rounded-sm transition-all duration-500" style={{ background: `rgba(0,236,145,${intensity})` }} />
              );
            })}
          </div>
        </div>
      </div>
    </GlassCard>
  );
});
ProtocolActivity.displayName = "ProtocolActivity";

/* ─────────────────────────────────────────────
   Alert Strip (Live)
───────────────────────────────────────────── */
/* ─────────────────────────────────────────────
   Alert Strip (Curated Feed)
───────────────────────────────────────────── */
const AlertStrip = memo(({ worker }: { worker: Worker | null }) => {
  const [alerts, setAlerts] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!worker) return;
    const handleMessage = (e: MessageEvent) => {
      if (e.data.type === "WHALE_ALERT") {
        setAlerts(prev => {
          // Add new alert to the start, keep only last 5
          const next = [e.data.tx, ...prev].slice(0, 5);
          return next;
        });
      }
    };
    worker.addEventListener("message", handleMessage);
    return () => worker.removeEventListener("message", handleMessage);
  }, [worker]);

  const severityThemes = useMemo(() => ({
    mega: { bg: "linear-gradient(90deg, rgba(222,51,55,0.15), rgba(153,69,255,0.15))", border: "rgba(222,51,55,0.3)", color: "#de3337", label: "MEGA WHALE", icon: <Flame className="size-4 animate-pulse" /> },
    large: { bg: "rgba(222,51,55,0.10)", border: "rgba(222,51,55,0.2)", color: "#de3337", label: "WHALE", icon: <Siren className="size-4" /> },
    normal: { bg: "rgba(153,69,255,0.07)", border: "rgba(153,69,255,0.15)", color: "#9945ff", label: "LARGE TRADE", icon: <AlertTriangle className="size-4" /> },
  }), []);

  if (alerts.length === 0) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl px-4 py-3 opacity-30" style={{ background: "rgba(222,51,55,0.07)", outline: "1px solid rgba(222,51,55,0.12)" }}>
        <div className="flex items-center gap-3">
          <CircleAlert className="size-4 shrink-0" style={{ color: "#de3337" }} />
          <span className="font-heading text-sm font-semibold tracking-wide" style={{ color: "#ebecf0" }}>Waiting for Live Whale Signals...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 min-h-[50px]">
      {alerts.map((alert, idx) => {
        const theme = severityThemes[alert.severity as keyof typeof severityThemes] || severityThemes.normal;
        return (
          <div
            key={alert.rawSignature || alert.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl px-4 py-3 animate-in fade-in slide-in-from-top-2 duration-500 ease-out"
            style={{
              background: theme.bg,
              outline: `1px solid ${theme.border}`,
              opacity: Math.max(0.4, 1 - (idx * 0.15)),
              transform: `scale(${1 - (idx * 0.02)}) translateY(${idx * 2}px)`,
              zIndex: 10 - idx,
              transition: "all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)"
            }}
          >
            <div className="flex items-center gap-3">
              <span style={{ color: theme.color }}>{theme.icon}</span>
              <span className="font-heading text-sm font-semibold tracking-wide" style={{ color: "#ebecf0" }}>
                {theme.label}: <span style={{ color: theme.color }}>{alert.value} {alert.type} on {alert.protocol}</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-heading text-[10px] tracking-[0.08em] uppercase" style={{ color: "#9ea0aa" }}>{idx === 0 ? "DETECTED NOW" : "RECENT"}</span>
              <Link href={`/tx/${alert.rawSignature || "abc123xyz"}`} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-heading text-xs font-semibold transition-all hover:bg-white/5" style={{ color: "#ebecf0" }}>
                View TX <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
});
AlertStrip.displayName = "AlertStrip";

/* ─────────────────────────────────────────────
   Transaction Feed (Live)
───────────────────────────────────────────── */
function TypeBadge({ type }: { type: Transaction["type"] }) {
  const map: Record<Transaction["type"], { bg: string; color: string }> = {
    Swap: { bg: "rgba(0,236,145,0.10)", color: "#00ec91" },
    Mint: { bg: "rgba(153,69,255,0.14)", color: "#9945ff" },
    Transfer: { bg: "rgba(222,51,55,0.10)", color: "#de3337" },
  };
  const s = map[type];
  return (
    <span className="inline-flex items-center rounded-md px-2 py-0.5 font-heading text-[10px] font-semibold tracking-[0.08em] uppercase" style={{ background: s.bg, color: s.color }}>
      {type}
    </span>
  );
}

/* ─────────────────────────────────────────────
   Table header columns (stable, never re-mounts)
───────────────────────────────────────────── */
const TX_TABLE_HEADER = (
  <tr style={{ height: "40px" }}>
    <th className="w-24 pb-3 pt-4 pl-4 sm:pl-6 font-heading text-[10px] font-semibold tracking-[0.08em] uppercase text-left" style={{ color: "#9ea0aa" }}>Type</th>
    <th className="w-32 pb-3 pt-4 px-2 font-heading text-[10px] font-semibold tracking-[0.08em] uppercase text-left" style={{ color: "#9ea0aa" }}>Protocol</th>
    <th className="w-48 pb-3 pt-4 px-2 font-heading text-[10px] font-semibold tracking-[0.08em] uppercase text-left" style={{ color: "#9ea0aa" }}>Description</th>
    <th className="w-28 pb-3 pt-4 px-2 font-heading text-[10px] font-semibold tracking-[0.08em] uppercase text-left" style={{ color: "#9ea0aa" }}>Value ($)</th>
    <th className="w-24 pb-3 pt-4 px-2 font-heading text-[10px] font-semibold tracking-[0.08em] uppercase text-left" style={{ color: "#9ea0aa" }}>Address</th>
    <th className="w-24 pb-3 pt-4 pr-4 sm:pr-6 font-heading text-[10px] font-semibold tracking-[0.08em] uppercase text-right" style={{ color: "#9ea0aa" }}>Time</th>
  </tr>
);


/* ─────────────────────────────────────────────
   Transaction Feed — virtualized + small-batch
───────────────────────────────────────────── */
const BATCH_SIZE = 20;   // max new rows per 500 ms flush
const MAX_VISIBLE = 100; // total rows kept in memory

const TransactionFeed = memo(({ worker, isPaused, togglePause, activeFilter, changeFilter }: {
  worker: Worker | null;
  isPaused: boolean;
  togglePause: () => void;
  activeFilter: "smart" | "all";
  changeFilter: (f: "smart" | "all") => void;
}) => {
  // visibleRef is the authoritative list; state is just a snapshot sent to React
  const visibleRef = useRef<Transaction[]>(initialTransactions);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const txQueue = useRef<Transaction[]>([]);
  const seenKeys = useRef<Set<string>>(new Set(initialTransactions.map(t => t.rawSignature || t.id || "")));

  // Effect to clear list and cache when filter changes to provide instant visual feedback
  useEffect(() => {
    setTransactions([]);
    visibleRef.current = [];
    seenKeys.current = new Set();
    txQueue.current = [];
  }, [activeFilter]);

  useEffect(() => {
    if (!worker) return;

    const handleMessage = (e: MessageEvent) => {
      const { type, tx } = e.data;
      if (type === "NEW_TRANSACTION" || type === "WHALE_ALERT") {
        txQueue.current.push(tx);
      }
    };

    worker.addEventListener("message", handleMessage);

    const flushInterval = setInterval(() => {
      // Skip if paused, tab hidden, or nothing queued
      if (isPaused || document.hidden || txQueue.current.length === 0) return;

      // ── Dynamic Batching: 'All' feels like a waterfall; 'Smart' stays steady ──
      const currentBatchSize = activeFilter === "all" ? 60 : BATCH_SIZE;
      const batch = txQueue.current.splice(0, currentBatchSize);

      // Deduplicate against already-visible rows
      const fresh: Transaction[] = [];
      for (const tx of batch) {
        const key = tx.rawSignature || tx.id || "";
        if (!seenKeys.current.has(key)) {
          seenKeys.current.add(key);
          fresh.push(tx);
        }
      }
      if (fresh.length === 0) return;

      // Prepend new rows, cap at MAX_VISIBLE, evict old keys from seen-set
      const next = [...fresh.reverse(), ...visibleRef.current].slice(0, MAX_VISIBLE);
      // Prune evicted signatures from seenKeys so the Set stays bounded
      if (next.length === MAX_VISIBLE) {
        const retained = new Set(next.map(t => t.rawSignature || t.id || ""));
        seenKeys.current = retained;
      }
      visibleRef.current = next;

      // Push a new array reference so React diffing is O(1) at the Feed level
      setTransactions(next);
    }, 500);

    return () => {
      worker.removeEventListener("message", handleMessage);
      clearInterval(flushInterval);
    };
  }, [worker, isPaused]);

  return (
    <GlassCard>
      {/* ── Header bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5" style={{ borderBottom: "1px solid rgba(158,160,170,0.07)" }}>
        <div className="flex items-center gap-3">
          <p className="font-heading text-xl font-semibold" style={{ color: "#ebecf0" }}>Transaction Feed</p>
          <span className="flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-heading text-[10px] font-semibold tracking-[0.08em] uppercase" style={{ background: isPaused ? "rgba(222,51,55,0.10)" : "rgba(0,236,145,0.10)", color: isPaused ? "#de3337" : "#00ec91" }}>
            {!isPaused && (
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full opacity-75" style={{ background: "#00ec91" }} />
                <span className="relative inline-flex size-1.5 rounded-full" style={{ background: "#00ec91" }} />
              </span>
            )}
            {isPaused ? "Paused" : "Live WebSockets"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center overflow-hidden rounded-xl" style={{ background: "rgba(158,160,170,0.07)" }}>
            <button onClick={() => changeFilter("smart")} className="flex items-center gap-2 px-3.5 py-2 font-heading text-xs font-semibold tracking-wide transition-all hover:bg-white/5" style={{ color: activeFilter === "smart" ? "#9945ff" : "#ebecf0" }}>
              <Compass className="size-3.5" />
              <span className="hidden sm:block">Smart Filter</span>
            </button>
            <div className="h-4 w-px shrink-0" style={{ background: "rgba(158,160,170,0.15)" }} />
            <button onClick={() => changeFilter("all")} className="px-3.5 py-2 font-heading text-xs font-semibold tracking-wide transition-all hover:bg-white/5" style={{ color: activeFilter === "all" ? "#9945ff" : "#ebecf0" }}>
              All
            </button>
          </div>
          <button
            onClick={togglePause}
            className="flex items-center gap-2 rounded-xl px-3.5 py-2 font-heading text-xs font-semibold tracking-wide transition-all hover:bg-white/5"
            style={{ background: isPaused ? "rgba(222,51,55,0.15)" : "rgba(158,160,170,0.07)", color: isPaused ? "#f8f5ff" : "#ebecf0" }}
          >
            <Pause className="size-3" />
            <span className="hidden sm:block">{isPaused ? "Resume Feed" : "Pause Feed"}</span>
          </button>
        </div>
      </div>

      {/* ── Virtualized table — only visible rows touch the DOM ── */}
      <TableVirtuoso
        style={{ height: 600 }}
        data={transactions}
        fixedHeaderContent={() => TX_TABLE_HEADER}
        itemContent={(_index, tx) => (
          <>
            <td className="py-4 pl-4 sm:pl-6 pr-2 w-24"><TypeBadge type={tx.type} /></td>
            <td className="py-4 px-2 font-sans text-sm w-32" style={{ color: "#ebecf0" }}>{tx.protocol}</td>
            <td className="py-4 px-2 font-sans text-sm w-48" style={{ color: "#9ea0aa" }}>
              <div className="line-clamp-1 max-w-full">{tx.description}</div>
            </td>
            <td className="py-4 px-2 font-heading text-sm font-semibold tabular-nums w-28" style={{ color: tx.type === "Transfer" ? "#de3337" : tx.type === "Swap" ? "#00ec91" : "#ebecf0" }}>{tx.value}</td>
            <td className="py-4 px-2 font-heading text-xs tabular-nums w-24" style={{ color: "#9ea0aa" }}>{tx.address}</td>
            <td className="py-4 pr-4 sm:pr-6 text-right font-heading text-xs tabular-nums w-24" style={{ color: "#9ea0aa" }}>{tx.time}</td>
          </>
        )}
        components={{
          Table: ({ style, ...props }) => (
            <table
              {...props}
              className="w-full min-w-[600px]"
              style={{ ...style, tableLayout: "fixed" }}
            />
          ),
          TableHead: ({ style, ...props }) => (
            <thead
              {...props}
              className="sticky top-0 z-10"
              style={{ ...style, background: "#121318" }}
            />
          ),
          TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
            <tbody
              {...props}
              ref={ref}
              style={{ contain: "layout paint" }}
            />
          )),
          TableRow: ({ style, item: _item, ...props }) => (
            <tr
              {...props}
              className="group cursor-pointer transition-colors duration-150"
              style={style}
              onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "rgba(153,69,255,0.05)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "transparent"; }}
            />
          ),
        }}
        computeItemKey={(_index, tx) => tx.rawSignature || tx.id || String(_index)}
      />
    </GlassCard>
  );
});
TransactionFeed.displayName = "TransactionFeed";

/* ─────────────────────────────────────────────
   Root export
───────────────────────────────────────────── */
export function Dashboard() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab");
  const activeView = activeTab === "analytics" ? "analytics" : activeTab === "ecosystem" ? "ecosystem" : "terminal";
  const [activeFilter, setActiveFilter] = useState<"smart" | "all">("smart");
  const [isPaused, setIsPaused] = useState(false);
  const [worker, setWorker] = useState<Worker | null>(null);
  const isPausedRef = useRef(isPaused);

  // Persistent Session Analytics State (survives tab switching)
  const [liveVolume, setLiveVolume] = useState<Record<string, number>>({});
  const [globalStats, setGlobalStats] = useState({ totalVol: "$0", activeCount: 0 });

  // Point 2: Stabilize function references with useCallback so the memoized Feed doesn't re-render
  const togglePause = useCallback(() => {
    isPausedRef.current = !isPausedRef.current;
    setIsPaused(isPausedRef.current);
  }, []);

  const changeFilter = useCallback((f: "smart" | "all") => {
    setActiveFilter(f);
    if (worker) {
      worker.postMessage({ type: "SET_FILTER", payload: f });
    }
  }, [worker]);

  useEffect(() => {
    if (!worker) return;

    const handleMessage = (e: MessageEvent) => {
      const { type, payload } = e.data;

      // Persist these in Dashboard state so AnalyticsView doesn't reset on remount
      if (type === "PROTOCOL_VOLUME") {
        setLiveVolume(payload);
      }
      if (type === "METRICS_UPDATE") {
        const totalUsd = payload.whaleVolumeTotal + (payload.tps * 8);
        setGlobalStats({
          totalVol: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact" }).format(totalUsd),
          activeCount: payload.activeCount,
        });
      }

      if (type === "CHECK_CONNECTION_SIGNAL") {
        // handle internal heartbeat
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && worker) {
        worker.postMessage({ type: "CHECK_CONNECTION" });
      }
    };

    worker.addEventListener("message", handleMessage);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      worker.removeEventListener("message", handleMessage);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [worker]);

  useEffect(() => {
    let activeWorker: Worker | null = null;

    fetch("/api/ws-config")
      .then((res) => res.json())
      .then((data) => {
        if (!data.url) return;

        activeWorker = new Worker(new URL("@/workers/transactionWorker.ts", import.meta.url));
        setWorker(activeWorker);
        activeWorker.postMessage({
          type: "INIT",
          payload: {
            wsUrl: data.url,
            initialFilter: activeFilter
          }
        });
      })
      .catch(console.error);

    return () => {
      if (activeWorker) {
        activeWorker.postMessage({ type: "DISCONNECT" });
        activeWorker.terminate();
      }
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* ── Dashboard Navigation Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-1">
        <div className="hidden items-center gap-2 rounded-2xl p-1 w-fit sm:flex" style={{ color: "#9ea0aa" }}>
          <span className="font-heading text-xs font-bold uppercase tracking-widest opacity-50">Dashboard / {activeView === "terminal" ? "Live Terminal" : "Deep Analytics"}</span>
        </div>

        <div className="flex items-center gap-4 px-2">
          <div className="flex flex-col items-end">
            <span className="font-heading text-[10px] font-bold uppercase tracking-widest text-[#9ea0aa]">Network Pulse</span>
            <span className="font-heading text-xs font-bold text-[#00ec91]">OPERATIONAL</span>
          </div>
          <div className="size-2 rounded-full bg-[#00ec91] animate-pulse shadow-[0_0_8px_#00ec91]" />
        </div>
      </div>

      <div className="transition-all duration-500">
        {activeView === "terminal" ? (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-left-4 duration-500">
            <MetricsRow worker={worker} />

            <section className="grid gap-4 lg:grid-cols-[1.9fr_1fr]">
              <MarketChart />
              <ProtocolActivity worker={worker} />
            </section>

            <AlertStrip worker={worker} />

            <TransactionFeed
              worker={worker}
              isPaused={isPaused}
              togglePause={togglePause}
              activeFilter={activeFilter}
              changeFilter={changeFilter}
            />
          </div>
        ) : activeView === "analytics" ? (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <AnalyticsView worker={worker} liveVolume={liveVolume} globalStats={globalStats} />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <EcosystemView liveVolume={liveVolume} />
          </div>
        )}
      </div>
    </div>
  );
}
