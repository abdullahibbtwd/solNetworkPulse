"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { ArrowRight, Box, Boxes, Code2, ExternalLink, Globe, LayoutGrid, ShieldCheck, Trophy } from "lucide-react";
import Link from "next/link";

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
const protocols = [
  { name: "Jupiter", category: "DeFi", type: "DEX Aggregator", description: "The premier liquidity aggregator for Solana, offering the best swap rates and limit orders.", volume: "$840M", score: 98, website: "jup.ag", color: "#9945ff" },
  { name: "Raydium", category: "DeFi", type: "AMM", description: "An avenue for the evolution of DeFi, providing lightning-fast swaps and deep liquidity.", volume: "$560M", score: 92, website: "raydium.io", color: "#00ec91" },
  { name: "Orca", category: "DeFi", type: "AMM", description: "The most user-friendly DEX on Solana with concentrated liquidity.", volume: "$300M", score: 88, website: "orca.so", color: "#f5a524" },
  { name: "Tensor", category: "NFT", type: "Marketplace", description: "The pro NFT trading platform for power users and creators.", volume: "$200M", score: 85, website: "tensor.trade", color: "#de3337" },
  { name: "Magic Eden", category: "NFT", type: "Marketplace", description: "The leading community-centric NFT marketplace.", volume: "$100M", score: 82, website: "magiceden.io", color: "#9945ff" },
  { name: "Helius", category: "Infrastructure", type: "RPC & APIs", description: "Solana's leading RPC and API platform for serious developers.", volume: "N/A", score: 95, website: "helius.dev", color: "#00ec91" },
];

const categories = [
  { name: "DeFi", icon: Boxes, count: 124, active: true },
  { name: "NFT", icon: LayoutGrid, count: 85, active: false },
  { name: "Infrastructure", icon: Code2, count: 42, active: false },
  { name: "Gaming", icon: Box, count: 36, active: false },
];

/* ─────────────────────────────────────────────
   Components
───────────────────────────────────────────── */
function CategoriesSidebar() {
  return (
    <GlassCard className="col-span-full lg:col-span-1 h-fit">
      <div className="flex flex-col p-5">
        <h2 className="mb-4 font-heading text-lg font-semibold tracking-wide" style={{ color: "#ebecf0" }}>
          Sectors
        </h2>
        <div className="flex flex-col gap-2">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              className="flex items-center justify-between rounded-xl p-3 transition-all"
              style={
                cat.active
                  ? { background: "rgba(153,69,255,0.12)", borderLeft: "2px solid #9945ff" }
                  : { background: "transparent", borderLeft: "2px solid transparent" }
              }
            >
              <div className="flex items-center gap-3">
                <cat.icon className="size-4" style={{ color: cat.active ? "#9945ff" : "#9ea0aa" }} />
                <span className="font-heading text-sm font-semibold tracking-wide" style={{ color: cat.active ? "#ebecf0" : "#9ea0aa" }}>
                  {cat.name}
                </span>
              </div>
              <span className="font-heading text-xs tabular-nums" style={{ color: "#9ea0aa" }}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold tracking-wide" style={{ color: "#ebecf0" }}>
              Top 5 Active
            </h2>
            <Trophy className="size-4" style={{ color: "#f5a524" }} />
          </div>
          <div className="flex flex-col gap-1 rounded-xl" style={{ background: "rgba(158,160,170,0.05)", outline: "1px solid rgba(158,160,170,0.08)" }}>
            {protocols
              .sort((a, b) => b.score - a.score)
              .slice(0, 5)
              .map((p, i) => (
                <div key={p.name} className="flex items-center gap-3 p-3">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-md font-heading text-[10px] font-bold" style={{ background: "rgba(255,255,255,0.1)", color: "#ebecf0" }}>
                    {i + 1}
                  </span>
                  <span className="font-heading text-sm font-medium" style={{ color: "#ebecf0" }}>{p.name}</span>
                  <div className="ml-auto flex items-center gap-1.5">
                    <Zap className="size-3" style={{ color: "#00ec91" }} />
                    <span className="font-heading text-xs tabular-nums" style={{ color: "#00ec91" }}>{p.score}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
// Note: redefining Zap locally for leaderboard
const Zap = ({ className, style }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>
);

function ProtocolDirectory() {
  return (
    <div className="col-span-full lg:col-span-3">
      <div className="mb-4 flex items-center justify-between px-1">
        <h1 className="font-heading text-2xl font-semibold" style={{ color: "#ebecf0" }}>
          Protocol Directory
        </h1>
        <div className="flex gap-2">
          <button className="rounded-lg px-3 py-1.5 font-heading text-xs font-semibold transition-all hover:bg-white/5" style={{ background: "rgba(158,160,170,0.08)", color: "#ebecf0" }}>
            Filter
          </button>
          <button className="rounded-lg px-3 py-1.5 font-heading text-xs font-semibold transition-all hover:bg-white/5" style={{ background: "rgba(158,160,170,0.08)", color: "#ebecf0" }}>
            Sort by Volume
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {protocols.map((protocol) => (
          <GlassCard key={protocol.name} className="flex flex-col transition-transform hover:scale-[1.02]">
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
                  <p className="font-heading text-sm font-bold tabular-nums" style={{ color: "#ebecf0" }}>{protocol.volume}</p>
                </div>
                <div>
                  <p className="font-heading text-[10px] tracking-wider uppercase" style={{ color: "#9ea0aa" }}>Activity Score</p>
                  <p className="flex items-center gap-1 font-heading text-sm font-bold tabular-nums" style={{ color: "#00ec91" }}>
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
                  className="flex items-center gap-1.5 font-heading text-xs font-semibold transition-colors hover:text-white"
                  style={{ color: "#9ea0aa" }}
                >
                  Visit <ExternalLink className="size-3" />
                </Link>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

export function EcosystemView() {
  return (
    <div className="grid gap-4 lg:grid-cols-4">
      <CategoriesSidebar />
      <ProtocolDirectory />
    </div>
  );
}
