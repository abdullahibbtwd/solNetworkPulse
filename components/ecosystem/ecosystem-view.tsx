"use client";

import React, { useState, useMemo } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { ArrowRight, Box, Boxes, Code2, ExternalLink, Globe, LayoutGrid, ShieldCheck, Trophy, Zap } from "lucide-react";
import Link from "next/link";

/* ─────────────────────────────────────────────
   Types & Data
───────────────────────────────────────────── */
interface Protocol {
  name: string;
  category: "DeFi" | "NFT" | "Infrastructure" | "Gaming";
  type: string;
  description: string;
  volume: string;
  score: number;
  website: string;
  color: string;
}

const INITIAL_PROTOCOLS: Protocol[] = [
  { name: "Jupiter", category: "DeFi", type: "DEX Aggregator", description: "The premier liquidity aggregator for Solana, offering the best swap rates and limit orders.", volume: "$840M", score: 98, website: "jup.ag", color: "#9945ff" },
  { name: "Raydium", category: "DeFi", type: "AMM", description: "An avenue for the evolution of DeFi, providing lightning-fast swaps and deep liquidity.", volume: "$560M", score: 92, website: "raydium.io", color: "#00ec91" },
  { name: "Orca", category: "DeFi", type: "AMM", description: "The most user-friendly DEX on Solana with concentrated liquidity.", volume: "$300M", score: 88, website: "orca.so", color: "#f5a524" },
  { name: "Tensor", category: "NFT", type: "Marketplace", description: "The pro NFT trading platform for power users and creators.", volume: "$200M", score: 85, website: "tensor.trade", color: "#de3337" },
  { name: "Magic Eden", category: "NFT", type: "Marketplace", description: "The leading community-centric NFT marketplace.", volume: "$100M", score: 82, website: "magiceden.io", color: "#9945ff" },
  { name: "Helius", category: "Infrastructure", type: "RPC & APIs", description: "Solana's leading RPC and API platform for serious developers.", volume: "N/A", score: 95, website: "helius.dev", color: "#00ec91" },
  { name: "Meteora", category: "DeFi", type: "Yield Aggregator", description: "Dynamic LST liquidity and yield infrastructure for Solana.", volume: "$120M", score: 84, website: "meteora.ag", color: "#14f195" },
  { name: "Kamino", category: "DeFi", type: "Lending", description: "The unified portal for borrowing, lending, and liquidity on Solana.", volume: "$180M", score: 87, website: "kamino.finance", color: "#9945ff" },
  { name: "Star Atlas", category: "Gaming", type: "MMORPG", description: "A grand strategy game of space exploration, territorial conquest, and political domination.", volume: "N/A", score: 78, website: "staratlas.com", color: "#f5a524" },
];

const CATEGORY_MAP = [
  { id: "all", name: "All Sectors", icon: LayoutGrid },
  { id: "DeFi", name: "DeFi", icon: Boxes },
  { id: "NFT", name: "NFT", icon: Box },
  { id: "Infrastructure", name: "Infrastructure", icon: Code2 },
  { id: "Gaming", name: "Gaming", icon: Globe },
];

/* ─────────────────────────────────────────────
   Ecosystem View Component
───────────────────────────────────────────── */
interface EcosystemViewProps {
  liveVolume?: Record<string, number>;
}

export function EcosystemView({ liveVolume = {} }: EcosystemViewProps) {
  const [activeTab, setActiveTab] = useState("all");

  // Sync volume data from live terminal stream
  const protocols = useMemo(() => {
    return INITIAL_PROTOCOLS.map(p => {
      const liveVal = liveVolume[p.name];
      if (liveVal) {
        return {
          ...p,
          volume: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact" }).format(liveVal),
          score: Math.min(100, p.score + (liveVal > 1000000 ? 1 : 0))
        };
      }
      return p;
    });
  }, [liveVolume]);

  // Dynamic Categories with Counts
  const displayCategories = useMemo(() => {
    return CATEGORY_MAP.map(cat => ({
      ...cat,
      count: cat.id === "all" 
        ? protocols.length 
        : protocols.filter(p => p.category === cat.id).length
    }));
  }, [protocols]);

  const filteredProtocols = useMemo(() => {
    if (activeTab === "all") return protocols;
    return protocols.filter(p => p.category === activeTab);
  }, [protocols, activeTab]);

  // Top 5 Active Leaderboard logic
  const topActive = useMemo(() => {
    return [...protocols].sort((a, b) => b.score - a.score).slice(0, 5);
  }, [protocols]);

  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {/* Categories Sidebar */}
      <GlassCard className="col-span-full lg:col-span-1 h-fit">
        <div className="flex flex-col p-5">
          <h2 className="mb-4 font-heading text-lg font-semibold tracking-wide" style={{ color: "#ebecf0" }}>
            Ecosystem Pulse
          </h2>
          <div className="flex flex-col gap-2">
            {displayCategories.map((cat) => {
              const active = cat.id === activeTab;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className="group flex items-center justify-between rounded-xl p-3 transition-all hover:bg-white/5 active:scale-95"
                  style={
                    active
                      ? { background: "rgba(153,69,255,0.12)", borderLeft: "2px solid #9945ff" }
                      : { background: "transparent", borderLeft: "2px solid transparent" }
                  }
                >
                  <div className="flex items-center gap-3">
                    <cat.icon className="size-4 transition-transform group-hover:scale-110" style={{ color: active ? "#9945ff" : "#9ea0aa" }} />
                    <span className="font-heading text-sm font-semibold tracking-wide" style={{ color: active ? "#ebecf0" : "#9ea0aa" }}>
                      {cat.name}
                    </span>
                  </div>
                  <span className="font-heading text-xs tabular-nums opacity-60 transition-opacity group-hover:opacity-100" style={{ color: "#9ea0aa" }}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold tracking-wide" style={{ color: "#ebecf0" }}>
                Active Hotspots
              </h2>
              <Trophy className="size-4" style={{ color: "#f5a524" }} />
            </div>
            <div className="flex flex-col gap-1 rounded-xl" style={{ background: "rgba(158,160,170,0.05)", outline: "1px solid rgba(158,160,170,0.08)" }}>
              {topActive.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3 p-3 transition-colors hover:bg-white/5">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-md font-heading text-[10px] font-bold" style={{ background: "rgba(255,255,255,0.1)", color: "#ebecf0" }}>
                    {i + 1}
                  </span>
                  <span className="font-heading text-sm font-medium" style={{ color: "#ebecf0" }}>{p.name}</span>
                  <div className="ml-auto flex items-center gap-1.5">
                    <Zap className="size-3" style={{ color: liveVolume[p.name] ? "#00ec91" : "#9ea0aa" }} />
                    <span className="font-heading text-xs tabular-nums" style={{ color: liveVolume[p.name] ? "#00ec91" : "#9ea0aa" }}>{p.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Protocol Directory */}
      <div className="col-span-full lg:col-span-3">
        <div className="mb-4 flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-2xl font-semibold" style={{ color: "#ebecf0" }}>
              Protocol Directory
            </h1>
            <div className="rounded-full bg-[#00ec91]/10 px-2.5 py-0.5 font-heading text-[10px] font-bold text-[#00ec91]">
              {filteredProtocols.length} ACTIVE
            </div>
          </div>
          <div className="flex gap-2">
            <button className="rounded-lg px-3 py-1.5 font-heading text-xs font-semibold transition-all hover:bg-white/5" style={{ background: "rgba(158,160,170,0.08)", color: "#ebecf0" }}>
              Filter
            </button>
            <button className="rounded-lg px-3 py-1.5 font-heading text-xs font-semibold transition-all hover:bg-white/5" style={{ background: "rgba(158,160,170,0.08)", color: "#ebecf0" }}>
              Sort by Volume
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProtocols.map((protocol) => {
            const isLive = !!liveVolume[protocol.name];
            return (
              <GlassCard key={protocol.name} className="flex flex-col transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-[#9945ff]/5">
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h3 className="font-heading text-lg font-bold" style={{ color: "#ebecf0" }}>{protocol.name}</h3>
                      <span className="font-heading text-[10px] tracking-widest uppercase" style={{ color: protocol.color }}>
                        {protocol.type}
                      </span>
                    </div>
                    <div className="flex size-8 items-center justify-center rounded-xl" style={{ background: `linear-gradient(135deg, ${protocol.color}40, rgba(0,0,0,0.5))` }}>
                      <Globe className="size-4" style={{ color: protocol.color }} />
                    </div>
                  </div>

                  <p className="mb-6 flex-1 font-sans text-sm leading-relaxed" style={{ color: "#9ea0aa" }}>
                    {protocol.description}
                  </p>

                  <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl p-3" style={{ background: "rgba(158,160,170,0.05)" }}>
                    <div>
                      <p className="font-heading text-[10px] tracking-wider uppercase" style={{ color: "#9ea0aa" }}>24h Volume</p>
                      <div className="flex items-center gap-1.5">
                        <p className={`font-heading text-sm font-bold tabular-nums transition-colors duration-500 ${isLive ? "text-[#00ec91]" : "text-[#ebecf0]"}`}>
                          {protocol.volume}
                        </p>
                        {isLive && <div className="size-1.5 animate-pulse rounded-full bg-[#00ec91]" />}
                      </div>
                    </div>
                    <div>
                      <p className="font-heading text-[10px] tracking-wider uppercase" style={{ color: "#9ea0aa" }}>Activity Score</p>
                      <p className="flex items-center gap-1 font-heading text-sm font-bold tabular-nums" style={{ color: isLive ? "#00ec91" : "#ebecf0" }}>
                        {protocol.score} / 100
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1.5 opacity-70">
                      <ShieldCheck className="size-3.5" style={{ color: "#00ec91" }} />
                      <span className="font-heading text-[10px] font-semibold tracking-wide uppercase" style={{ color: "#00ec91" }}>Audited</span>
                    </div>
                    <Link
                      href={`https://${protocol.website}`}
                      target="_blank"
                      className="group/link flex items-center gap-1.5 font-heading text-xs font-semibold transition-colors hover:text-white"
                      style={{ color: "#9ea0aa" }}
                    >
                      Visit <ExternalLink className="size-3 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
