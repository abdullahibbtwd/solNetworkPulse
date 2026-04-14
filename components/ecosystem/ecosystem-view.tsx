"use client";

import React, { useState, useMemo, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Box, Boxes, Code2, ExternalLink, Globe, LayoutGrid, ShieldCheck, Trophy, Zap, RefreshCw } from "lucide-react";
import Link from "next/link";

/* ─────────────────────────────────────────────
   Types & Metadata
───────────────────────────────────────────── */
interface Protocol {
  name: string;
  symbol: string;
  category: string;
  type: string;
  description: string;
  volume: string;
  score: number;
  website: string;
  color: string;
  image?: string;
}

const PREMIUM_METADATA: Record<string, Partial<Protocol>> = {
  "solana": { category: "Infrastructure", type: "Layer 1", description: "The foundation of the ecosystem. A high-performance blockchain supporting builders globally.", color: "#00ec91", website: "solana.com" },
  "jupiter-exchange-solana": { category: "DeFi", type: "DEX Aggregator", description: "The best swap aggregation on Solana, providing the best price and experience.", color: "#9945ff", website: "jup.ag" },
  "raydium": { category: "DeFi", type: "AMM", description: "An on-chain order book AMM that powers the liquidity of the Solana ecosystem.", color: "#00ec91", website: "raydium.io" },
  "orca": { category: "DeFi", type: "AMM", description: "The pure AMM on Solana with concentrated liquidity for efficient swaps.", color: "#f5a524", website: "orca.so" },
  "tensor": { category: "NFT", type: "Marketplace", description: "The premier NFT trading platform for pro-traders on Solana.", color: "#de3337", website: "tensor.trade" },
  "helius": { category: "Infrastructure", type: "RPC & APIs", description: "Leading RPC and API platform for Solana developers.", color: "#9945ff", website: "helius.dev" },
  "jito-staked-sol": { category: "DeFi", type: "Liquid Staking", description: "Liquid staking that captures MEV rewards for SOL stakers.", color: "#9945ff", website: "jito.network" },
  "pyth-network": { category: "Infrastructure", type: "Oracle", description: "Hi-fidelity price feed oracle delivering real-time data to DeFi.", color: "#9ea0aa", website: "pyth.network" },
  "kamino-finance": { category: "DeFi", type: "Lending", description: "The one-stop shop for lending, liquidity, and borrowing on Solana.", color: "#9945ff", website: "kamino.finance" },
};

const CATEGORY_MAP = [
  { id: "all", name: "All Sectors", icon: LayoutGrid },
  { id: "DeFi", name: "DeFi", icon: Boxes },
  { id: "NFT", name: "NFT", icon: Box },
  { id: "Infrastructure", name: "Infrastructure", icon: Code2 },
  { id: "Gaming", name: "Gaming", icon: Globe },
];

/* ─────────────────────────────────────────────
   Components
───────────────────────────────────────────── */
function CardSkeleton() {
  return (
    <GlassCard className="flex h-[280px] flex-col animate-pulse">
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <div className="h-6 w-24 rounded-lg bg-white/5" />
            <div className="h-3 w-16 rounded-lg bg-white/5" />
          </div>
          <div className="size-8 rounded-xl bg-white/5" />
        </div>
        <div className="mb-6 flex-1 space-y-2">
          <div className="h-3 w-full rounded-lg bg-white/5" />
          <div className="h-3 w-4/5 rounded-lg bg-white/5" />
        </div>
        <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-white/5 p-3 h-14" />
        <div className="flex items-center justify-between h-5">
          <div className="h-3 w-16 rounded-lg bg-white/5" />
          <div className="h-3 w-12 rounded-lg bg-white/5" />
        </div>
      </div>
    </GlassCard>
  );
}

/* ─────────────────────────────────────────────
   Internal Components
───────────────────────────────────────────── */
function Leaderboard({ loading, topActive, updateTracker }: any) {
  return (
    <div className="flex flex-col gap-1 rounded-xl bg-white/5 border border-white/5">
      {loading ? (
        <div className="p-8 flex justify-center"><RefreshCw className="animate-spin size-4 text-white/20" /></div>
      ) : topActive.map((p: any, i: number) => (
        <div key={p.name} className="flex items-center gap-3 p-3">
          <span className="flex size-5 shrink-0 items-center justify-center rounded-md font-heading text-[10px] font-bold bg-white/10 text-zinc-100">
            {i + 1}
          </span>
          <span className="font-heading text-sm font-medium text-zinc-100 truncate">{p.name}</span>
          <div className="ml-auto flex items-center gap-1.5">
            <Zap 
              className={`size-3 transition-all duration-300 ${
                Date.now() - (updateTracker[p.name] || 0) < 1000 ? "text-[#00ec91] scale-125 brightness-150" : "text-[#00ec91]"
              }`} 
            />
            <span 
              className={`font-heading text-xs tabular-nums transition-all duration-300 ${
                Date.now() - (updateTracker[p.name] || 0) < 1000 ? "text-[#00ec91] font-bold" : "text-[#00ec91]"
              }`}
            >
              {p.score}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main View
───────────────────────────────────────────── */
interface EcosystemViewProps {
  liveVolume?: Record<string, number>;
}

export function EcosystemView({ liveVolume = {} }: EcosystemViewProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [allProtocols, setAllProtocols] = useState<Protocol[]>([]);
  const [updateTracker, setUpdateTracker] = useState<Record<string, number>>({});

  useEffect(() => {
    async function fetchEcosystem() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=solana-ecosystem&order=market_cap_desc&per_page=20&page=1&sparkline=false"
        );
        const data = await res.json();
        
        const mapped: Protocol[] = data.map((item: any) => {
          const meta = PREMIUM_METADATA[item.id] || {};
          const score = Math.round(80 + Math.min(20, Math.abs(item.price_change_percentage_24h || 0)));
          
          return {
            name: item.name,
            symbol: item.symbol.toUpperCase(),
            category: meta.category || (item.name.toLowerCase().includes("game") ? "Gaming" : "DeFi"),
            type: meta.type || "Solana Project",
            description: meta.description || `Leading ${item.name} implementation in the Solana ecosystem tracking market trends.`,
            volume: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact" }).format(item.total_volume),
            score: score,
            website: meta.website || `www.google.com/search?q=${item.name}+solana`,
            color: meta.color || "#00ec91",
            image: item.image
          };
        });

        setAllProtocols(mapped);
      } catch (err) {
        console.error("Ecosystem Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEcosystem();
  }, []);

  const protocols = useMemo(() => {
    return allProtocols.map(p => {
      const liveVal = liveVolume[p.name];
      if (liveVal) {
        return {
          ...p,
          volume: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact" }).format(liveVal),
          score: Math.min(100, p.score + 2)
        };
      }
      return p;
    });
  }, [allProtocols, liveVolume]);

  useEffect(() => {
    const newTracker: Record<string, number> = { ...updateTracker };
    let changed = false;
    Object.keys(liveVolume).forEach(name => {
      if (liveVolume[name] !== updateTracker[name]) {
        newTracker[name] = Date.now();
        changed = true;
      }
    });
    if (changed) setUpdateTracker(newTracker);
  }, [liveVolume]);

  const displayCategories = useMemo(() => {
    return CATEGORY_MAP.map(cat => ({
      ...cat,
      count: cat.id === "all" 
        ? protocols.length 
        : protocols.filter(p => p.category === cat.id).length
    }));
  }, [protocols, protocols.length]);

  const filteredProtocols = useMemo(() => {
    if (activeTab === "all") return protocols;
    return protocols.filter(p => p.category === activeTab);
  }, [protocols, activeTab]);

  const topActive = useMemo(() => {
    return [...protocols].sort((a, b) => b.score - a.score).slice(0, 5);
  }, [protocols]);

  return (
    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-4 lg:items-start">
      {/* Sidebar (Tablet/Desktop) */}
      <aside className="col-span-1 hidden lg:sticky lg:top-24 lg:block">
        <GlassCard className="h-fit">
          <div className="flex flex-col p-5">
            <h2 className="mb-4 font-heading text-lg font-semibold tracking-wide" style={{ color: "#ebecf0" }}>
              Sectors
            </h2>
            <div className="flex flex-col gap-2">
              {displayCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className="group flex items-center justify-between rounded-xl p-3 transition-all hover:bg-white/5"
                  style={cat.id === activeTab ? { background: "rgba(153,69,255,0.12)", borderLeft: "2px solid #9945ff" } : { background: "transparent", borderLeft: "2px solid transparent" }}
                >
                  <div className="flex items-center gap-3">
                    <cat.icon className="size-4" style={{ color: cat.id === activeTab ? "#9945ff" : "#9ea0aa" }} />
                    <span className="font-heading text-sm font-semibold tracking-wide" style={{ color: cat.id === activeTab ? "#ebecf0" : "#9ea0aa" }}>{cat.name}</span>
                  </div>
                  <span className="font-heading text-xs tabular-nums" style={{ color: "#9ea0aa" }}>{loading ? "..." : cat.count}</span>
                </button>
              ))}
            </div>

            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-heading text-lg font-semibold tracking-wide" style={{ color: "#ebecf0" }}>Active Pulses</h2>
                <Trophy className="size-4 text-[#f5a524]" />
              </div>
              <Leaderboard loading={loading} topActive={topActive} updateTracker={updateTracker} />
            </div>
          </div>
        </GlassCard>
      </aside>

      {/* Main Content Area */}
      <div className="col-span-full flex flex-col gap-4 lg:col-span-3">
        {/* Mobile-Only Categories (Horizontal Scroll) */}
        <nav className="flex w-full overflow-x-auto pb-2 scrollbar-none lg:hidden">
            <div className="flex gap-2">
                {displayCategories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveTab(cat.id)}
                        className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 font-heading text-sm font-semibold transition-all ${
                            cat.id === activeTab ? "bg-[#9945ff]/20 text-[#9945ff] border border-[#9945ff]/30" : "bg-white/5 text-[#9ea0aa] border border-white/10"
                        }`}
                    >
                        <cat.icon className="size-3.5" />
                        {cat.name}
                        <span className="ml-1 opacity-50 tabular-nums">{loading ? "" : cat.count}</span>
                    </button>
                ))}
            </div>
        </nav>

        {/* Directory Header */}
        <div className="mb-2 flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-2xl font-semibold text-zinc-100">Protocol Directory</h1>
            {!loading && <div className="rounded-full bg-[#00ec91]/10 px-2.5 py-0.5 font-heading text-[10px] font-bold text-[#00ec91]">{protocols.length} TOTAL</div>}
          </div>
          <button className="rounded-lg px-3 py-1.5 font-heading text-xs font-semibold bg-white/5 text-zinc-100 border border-white/5 lg:block hidden">Explore</button>
        </div>

        {/* Directory Grid */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)
          ) : filteredProtocols.map((protocol) => (
            <GlassCard key={protocol.name} className="flex flex-col transition-all hover:scale-[1.02]">
              <div className="flex flex-1 flex-col p-5">
                {(() => {
                  const isLive = !!liveVolume[protocol.name];
                  const updatedRecently = Date.now() - (updateTracker[protocol.name] || 0) < 1000;
                  return (
                    <>
                      <div className="mb-3 flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-heading text-lg font-bold text-zinc-100">{protocol.name}</h3>
                            <span className="font-heading text-[10px] text-zinc-500">{protocol.symbol}</span>
                          </div>
                          <span className="font-heading text-[10px] tracking-widest uppercase" style={{ color: protocol.color }}>{protocol.type}</span>
                        </div>
                        <div className="flex size-8 items-center justify-center rounded-xl bg-white/5 border border-white/5">
                          {protocol.image ? <img src={protocol.image} className="size-5 rounded-full" alt="" /> : <Globe className="size-4" style={{ color: protocol.color }} />}
                        </div>
                      </div>

                      <p className="mb-6 flex-1 font-sans text-xs leading-relaxed text-[#9ea0aa]">{protocol.description}</p>

                      <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-white/5 p-3">
                        <div>
                          <p className="font-heading text-[10px] tracking-wider uppercase text-[#9ea0aa]">24h Volume</p>
                          <p className="font-heading text-sm font-bold tabular-nums text-zinc-100">{protocol.volume}</p>
                        </div>
                        <div>
                          <p className="font-heading text-[10px] tracking-wider uppercase text-[#9ea0aa]">Activity</p>
                          <p className={`flex items-center gap-1 font-heading text-sm font-bold tabular-nums transition-all duration-300 ${updatedRecently ? "text-[#00ec91] scale-110 drop-shadow-[0_0_8px_rgba(0,236,145,0.5)]" : isLive ? "text-[#00ec91]" : "text-zinc-400"}`}>
                            {protocol.score}
                            {updatedRecently && <Zap className="size-3 animate-pulse" />}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-1.5 opacity-70">
                          <ShieldCheck className="size-3.5 text-[#00ec91]" />
                          <span className="font-heading text-[10px] font-semibold text-[#00ec91]">VALIDATED</span>
                        </div>
                        <Link href={`https://${protocol.website}`} target="_blank" className="flex items-center gap-1.5 font-heading text-xs font-semibold text-[#9ea0aa] hover:text-white transition-colors">
                          Site <ExternalLink className="size-3" />
                        </Link>
                      </div>
                    </>
                  );
                })()}
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Mobile-Only Leaderboard (Bottom) */}
        <div className="mt-4 flex flex-col lg:hidden">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="font-heading text-lg font-semibold tracking-wide" style={{ color: "#ebecf0" }}>Network Pulse Leaderboard</h2>
                <Trophy className="size-4 text-[#f5a524]" />
            </div>
            <Leaderboard loading={loading} topActive={topActive} updateTracker={updateTracker} />
        </div>
      </div>
    </div>
  );
}
