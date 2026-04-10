"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { ArrowRight, CheckCircle2, Copy, FileText, Pickaxe, Wallet } from "lucide-react";

/* ─────────────────────────────────────────────
   Mock Data Loader
───────────────────────────────────────────── */
function getMockTx(hash: string) {
  return {
    hash: hash,
    status: "Success",
    time: "2 minutes ago",
    fee: "0.000005 SOL",
    blockSlot: "258,491,332",
    program: "Jupiter Aggregator V6",
    action: {
      type: "Swap",
      description: "User swapped 4.5 SOL for 1,200 JUP",
    },
    transfers: [
      { from: "7xR...9wL", to: "Jup...V6", amount: "-4.5", token: "SOL", color: "#de3337" },
      { from: "Jup...V6", to: "7xR...9wL", amount: "+1,200", token: "JUP", color: "#00ec91" },
    ]
  };
}

export function TxView({ hash }: { hash: string }) {
  const tx = getMockTx(hash);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold" style={{ color: "#ebecf0" }}>
          Transaction Details
        </h1>
        <button className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 font-heading text-xs font-semibold transition-colors hover:bg-white/10" style={{ color: "#ebecf0" }}>
          <Copy className="size-3.5" style={{ color: "#9ea0aa" }} />
          Copy URL
        </button>
      </div>

      {/* Main Status Card */}
      <GlassCard className="p-6">
        <div className="mb-6 flex flex-col gap-4 border-b border-white/5 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
             <div className="flex size-10 items-center justify-center rounded-xl" style={{ background: "rgba(0,236,145,0.1)" }}>
               <CheckCircle2 className="size-5" style={{ color: "#00ec91" }} />
             </div>
             <div>
               <p className="font-heading text-sm font-semibold uppercase tracking-wide" style={{ color: "#00ec91" }}>{tx.status}</p>
               <div className="mt-1 flex items-center gap-2">
                 <span className="font-mono text-sm" style={{ color: "#ebecf0" }}>{tx.hash.substring(0, 12)}...{tx.hash.slice(-12)}</span>
                 <Copy className="size-3.5 cursor-pointer transition-colors hover:text-white" style={{ color: "#9ea0aa" }} />
               </div>
             </div>
          </div>
          <div className="flex gap-6 sm:text-right">
             <div className="flex flex-col">
               <span className="font-heading text-[10px] uppercase tracking-wider" style={{ color: "#9ea0aa" }}>Timestamp</span>
               <span className="mt-1 font-heading text-sm font-semibold" style={{ color: "#ebecf0" }}>{tx.time}</span>
             </div>
             <div className="flex flex-col">
               <span className="font-heading text-[10px] uppercase tracking-wider" style={{ color: "#9ea0aa" }}>Block Slot</span>
               <span className="mt-1 font-heading text-sm font-semibold tabular-nums" style={{ color: "#9945ff" }}>{tx.blockSlot}</span>
             </div>
          </div>
        </div>

        {/* Human Readable Explanation */}
        <div className="mb-6 rounded-xl p-5" style={{ background: "rgba(153,69,255,0.08)", border: "1px solid rgba(153,69,255,0.2)" }}>
           <div className="mb-3 flex items-center gap-2">
             <FileText className="size-4" style={{ color: "#9945ff" }} />
             <h3 className="font-heading text-sm font-bold tracking-wide" style={{ color: "#ebecf0" }}>Action Summary</h3>
           </div>
           <p className="font-sans text-base leading-relaxed" style={{ color: "#ebecf0" }}>
             {tx.action.description} on <span className="font-semibold text-white">{tx.program}</span>.
           </p>
        </div>

        {/* Details Grid */}
        <div className="grid gap-6 sm:grid-cols-2 mt-8">
           <div>
             <h3 className="mb-4 flex items-center gap-2 font-heading text-sm font-semibold tracking-wide" style={{ color: "#9ea0aa" }}>
               <Pickaxe className="size-4" /> Network Info
             </h3>
             <div className="space-y-3 rounded-xl p-4" style={{ background: "rgba(158,160,170,0.04)" }}>
                <div className="flex justify-between">
                  <span className="text-sm text-[#9ea0aa]">Network Fee</span>
                  <span className="font-heading text-sm font-semibold tabular-nums text-zinc-100">{tx.fee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#9ea0aa]">Compute Units</span>
                  <span className="font-heading text-sm tabular-nums text-zinc-100">42,100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#9ea0aa]">Signer</span>
                  <span className="font-mono text-sm text-[#9945ff]">7xR...9wL</span>
                </div>
             </div>
           </div>

           <div>
             <h3 className="mb-4 flex items-center gap-2 font-heading text-sm font-semibold tracking-wide" style={{ color: "#9ea0aa" }}>
               <Wallet className="size-4" /> Token Balances
             </h3>
             <div className="flex flex-col gap-2">
                {tx.transfers.map((tr, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl p-3" style={{ background: "rgba(158,160,170,0.04)" }}>
                     <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full" style={{ background: `linear-gradient(135deg, ${tr.color}40, transparent)`, border: `1px solid ${tr.color}` }} />
                        <span className="font-heading text-sm font-bold text-zinc-100">{tr.token}</span>
                     </div>
                     <span className="font-heading text-sm font-bold tabular-nums" style={{ color: tr.color }}>
                        {tr.amount}
                     </span>
                  </div>
                ))}
             </div>
           </div>
        </div>
      </GlassCard>
    </div>
  );
}
