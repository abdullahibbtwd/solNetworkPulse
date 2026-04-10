"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Lock, Wallet } from "lucide-react";

export function WalletView({ address }: { address: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-4">
      <GlassCard className="w-full max-w-lg overflow-hidden text-center">
        <div className="flex flex-col items-center justify-center p-12">
          <div className="relative mb-6">
            <div className="absolute inset-0 animate-pulse rounded-full bg-[#121318]" />
            <div className="relative flex size-20 items-center justify-center rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(153,69,255,0.2), rgba(0,236,145,0.1))", border: "1px solid rgba(153,69,255,0.3)" }}>
              <Lock className="size-8" style={{ color: "#9945ff" }} />
            </div>
            <div className="absolute -bottom-2 -right-2 flex size-8 items-center justify-center rounded-xl" style={{ background: "#121318", border: "1px solid rgba(158,160,170,0.15)" }}>
               <Wallet className="size-4" style={{ color: "#00ec91" }} />
            </div>
          </div>
          
          <h1 className="mb-2 font-heading text-2xl font-bold tracking-wide" style={{ color: "#ebecf0" }}>
            Wallet Profiles
          </h1>
          <p className="mb-8 max-w-sm font-sans text-sm leading-relaxed" style={{ color: "#9ea0aa" }}>
            Deep analytics, PNL tracking, and full transaction history for <span className="font-heading font-semibold" style={{ color: "#ebecf0" }}>{address}</span> are coming in the next update.
          </p>

          <button className="flex w-full items-center justify-center rounded-xl bg-white/5 py-3 font-heading text-sm font-bold tracking-widest uppercase transition-all hover:bg-white/10" style={{ color: "#ebecf0", outline: "1px solid rgba(158,160,170,0.15)" }}>
            Notify Me When Live
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
