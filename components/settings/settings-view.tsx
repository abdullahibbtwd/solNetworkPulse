"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Bell, Filter, Moon, Sun } from "lucide-react";

/* ─────────────────────────────────────────────
   Shared Toggle Component
───────────────────────────────────────────── */
function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#9945ff]/50 focus:ring-offset-2"
      style={{
        background: enabled ? "#9945ff" : "rgba(158,160,170,0.2)",
        outline: enabled ? "none" : "1px solid rgba(158,160,170,0.15)",
      }}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          enabled ? "translate-x-2" : "-translate-x-2"
        }`}
      />
    </button>
  );
}

/* ─────────────────────────────────────────────
   Settings Section Component
───────────────────────────────────────────── */
function SettingsSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
}) {
  return (
    <GlassCard className="mb-6">
      <div className="border-b border-white/5 bg-white/[0.02] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-xl" style={{ background: "rgba(153,69,255,0.12)", color: "#9945ff" }}>
            <Icon className="size-4" />
          </div>
          <h2 className="font-heading text-lg font-semibold tracking-wide text-zinc-100">{title}</h2>
        </div>
      </div>
      <div className="flex flex-col gap-5 p-5">
        {children}
      </div>
    </GlassCard>
  );
}

/* ─────────────────────────────────────────────
   Main View
───────────────────────────────────────────── */
export function SettingsView() {
  const [preferences, setPreferences] = useState({
    alertTradeSize: true,
    alertWhales: true,
    feedHideSmall: false,
    feedShowNFT: true,
    feedOnlySwaps: false,
    theme: "dark" as "dark" | "light",
  });

  const toggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 font-heading">
        <h1 className="text-2xl font-bold tracking-wide text-zinc-100">Application Settings</h1>
        <p className="mt-2 text-sm text-[#9ea0aa]">Configure your dashboard preferences and data feeds.</p>
      </div>

      <SettingsSection title="Alert Preferences" icon={Bell}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-heading text-sm font-semibold text-zinc-100">Large Trade Alerts</p>
            <p className="text-xs text-[#9ea0aa] mt-1">Receive notifications when a trade exceeds $5,000</p>
          </div>
          <Toggle enabled={preferences.alertTradeSize} onChange={() => toggle("alertTradeSize")} />
        </div>
        <div className="my-2 h-px w-full" style={{ background: "rgba(158,160,170,0.08)" }} />
        <div className="flex items-center justify-between">
          <div>
            <p className="font-heading text-sm font-semibold text-zinc-100">Whale Activity Spikes</p>
            <p className="text-xs text-[#9ea0aa] mt-1">Notify when unusual aggregate volume is detected</p>
          </div>
          <Toggle enabled={preferences.alertWhales} onChange={() => toggle("alertWhales")} />
        </div>
      </SettingsSection>

      <SettingsSection title="Feed Preferences" icon={Filter}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-heading text-sm font-semibold text-zinc-100">Hide Micro-Transactions</p>
            <p className="text-xs text-[#9ea0aa] mt-1">Filter out all transactions under $10 from the main feed</p>
          </div>
          <Toggle enabled={preferences.feedHideSmall} onChange={() => toggle("feedHideSmall")} />
        </div>
        <div className="my-2 h-px w-full" style={{ background: "rgba(158,160,170,0.08)" }} />
        <div className="flex items-center justify-between">
          <div>
            <p className="font-heading text-sm font-semibold text-zinc-100">Show NFT Activity</p>
            <p className="text-xs text-[#9ea0aa] mt-1">Include mints and trades from Tensor and Magic Eden</p>
          </div>
          <Toggle enabled={preferences.feedShowNFT} onChange={() => toggle("feedShowNFT")} />
        </div>
        <div className="my-2 h-px w-full" style={{ background: "rgba(158,160,170,0.08)" }} />
        <div className="flex items-center justify-between">
          <div>
            <p className="font-heading text-sm font-semibold text-zinc-100">Swaps Only Mode</p>
            <p className="text-xs text-[#9ea0aa] mt-1">Restrict the feed strictly to SPL token swaps (hide transfers/mints)</p>
          </div>
          <Toggle enabled={preferences.feedOnlySwaps} onChange={() => toggle("feedOnlySwaps")} />
        </div>
      </SettingsSection>

      <SettingsSection title="Appearance" icon={Moon}>
        <div>
          <p className="mb-4 font-heading text-sm font-semibold text-zinc-100">Color Theme</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setPreferences({ ...preferences, theme: "dark" })}
              className="flex flex-1 flex-col items-center gap-3 rounded-xl p-4 transition-all"
              style={{
                background: preferences.theme === "dark" ? "rgba(153,69,255,0.08)" : "rgba(158,160,170,0.05)",
                border: preferences.theme === "dark" ? "1px solid rgba(153,69,255,0.4)" : "1px solid transparent"
              }}
            >
              <Moon className="size-6" style={{ color: preferences.theme === "dark" ? "#9945ff" : "#9ea0aa" }} />
              <span className="font-heading text-xs font-semibold uppercase tracking-wide" style={{ color: preferences.theme === "dark" ? "#ebecf0" : "#9ea0aa" }}>Dark Mode</span>
            </button>
            
            <button
              onClick={() => setPreferences({ ...preferences, theme: "light" })}
              className="flex flex-1 flex-col items-center gap-3 rounded-xl p-4 transition-all opacity-50 cursor-not-allowed"
              style={{
                background: preferences.theme === "light" ? "rgba(255,255,255,0.1)" : "rgba(158,160,170,0.05)",
                border: preferences.theme === "light" ? "1px solid white" : "1px solid transparent"
              }}
            >
              <Sun className="size-6 text-[#9ea0aa]" />
              <div className="text-center">
                <span className="font-heading text-xs font-semibold uppercase tracking-wide text-[#9ea0aa] block">Light Mode</span>
                <span className="text-[9px] text-[#de3337] uppercase tracking-wider font-bold mt-1 block">Unavailable</span>
              </div>
            </button>
          </div>
          {preferences.theme === "dark" && (
             <p className="mt-4 text-xs text-[#00ec91] font-heading tracking-wide">
               <span className="mr-1">✧</span> Obsidian Navy Kinetic Monolith aesthetic active.
             </p>
          )}
        </div>
      </SettingsSection>

      <div className="flex justify-end pt-4 pb-12">
         <button className="rounded-xl px-6 py-2.5 font-heading text-sm font-bold shadow-lg transition-all hover:opacity-90 active:scale-[98%]" style={{ background: "linear-gradient(135deg, #9945ff, #7c31e0)", color: "#f8f5ff" }}>
            Save Changes
         </button>
      </div>
    </div>
  );
}
