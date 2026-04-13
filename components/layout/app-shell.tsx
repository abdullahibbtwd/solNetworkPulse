"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Bell,
  CheckCircle2,
  CircleAlert,
  Globe,
  LayoutDashboard,
  LineChart,
  Menu,
  Search,
  Settings,
  Trash2,
  Wallet,
  X,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

const sideNavItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Deep Analytics", href: "/?tab=analytics", icon: LineChart },
  { label: "Ecosystem", href: "/?tab=ecosystem", icon: Globe },
];

/* ─────────────────────────────────────────────
   Notifications Modal
───────────────────────────────────────────── */
function NotificationsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [cleared, setCleared] = useState(false);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 transition-opacity bg-[#121318]/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed right-4 top-16 z-[60] w-full max-w-sm sm:right-6 sm:top-[72px]">
        <GlassCard className="flex max-h-[500px] flex-col overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
            <h3 className="font-heading text-sm font-semibold text-zinc-100">Notifications</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCleared(true)}
                className="flex items-center gap-1.5 rounded-lg px-2 py-1 transition-colors hover:bg-white/5"
              >
                <Trash2 className="size-3.5 text-[#9ea0aa]" />
                <span className="font-heading text-[10px] font-semibold uppercase tracking-wider text-[#9ea0aa]">Clear All</span>
              </button>
              <button onClick={onClose} className="rounded-lg p-1 transition-colors hover:bg-white/5">
                <X className="size-4 text-[#9ea0aa]" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {cleared ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 className="mb-2 size-8 text-[#00ec91] opacity-50" />
                <p className="font-heading text-sm font-semibold text-zinc-100">All caught up</p>
                <p className="text-xs text-[#9ea0aa]">You have no new notifications.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {[
                  { title: "Whale Alert", desc: "$240,000 SOL swap detected on Jupiter", time: "3:41 PM", type: "alert" },
                  { title: "Protocol Spike", desc: "Raydium activity increased 120% in last 5m", time: "3:35 PM", type: "info" },
                  { title: "Large Mint", desc: "Mad Lads #8882 minted for 160 SOL", time: "2:15 PM", type: "nft" }
                ].map((notif, i) => (
                  <div key={i} className="flex gap-3 rounded-xl p-3 transition-colors hover:bg-white/5">
                    <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg" style={{ background: notif.type === "alert" ? "rgba(222,51,55,0.1)" : "rgba(153,69,255,0.1)"}}>
                       {notif.type === "alert" ? <CircleAlert className="size-4 text-[#de3337]" /> : <Bell className="size-4 text-[#9945ff]" />}
                    </div>
                    <div>
                      <div className="flex items-center justify-between gap-4">
                         <span className="font-heading text-xs font-semibold text-zinc-100">{notif.title}</span>
                         <span className="shrink-0 font-heading text-[10px] text-[#9ea0aa]">{notif.time}</span>
                      </div>
                      <p className="mt-1 font-sans text-xs text-[#9ea0aa] leading-relaxed">{notif.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   Mobile Sidebar
───────────────────────────────────────────── */
function Sidebar({ open, onClose, onOpenNotifications }: { open: boolean; onClose: () => void; onOpenNotifications: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "terminal";

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 transition-all duration-300 lg:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "rgba(18,19,24,0.75)", backdropFilter: "blur(6px)" }}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col transition-transform duration-300 ease-in-out lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "linear-gradient(180deg, #1a1b21 0%, #121318 100%)",
          borderRight: "1px solid rgba(158,160,170,0.08)",
        }}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <Link href="/" onClick={onClose} className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl" style={{ background: "linear-gradient(135deg, #9945ff, #00ec91)" }} />
            <span className="font-heading text-sm font-semibold tracking-widest" style={{ color: "#ebecf0", letterSpacing: "0.16em" }}>SOLANA PULSE</span>
          </Link>
          <button onClick={onClose} className="flex size-8 items-center justify-center rounded-lg transition-all hover:bg-white/5" style={{ color: "#9ea0aa" }}>
            <X className="size-4" />
          </button>
        </div>

        <div className="px-5 pb-5">
          <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: "rgba(0,236,145,0.06)", outline: "1px solid rgba(0,236,145,0.10)" }}>
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full opacity-75" style={{ background: "#00ec91" }} />
              <span className="relative inline-flex size-1.5 rounded-full" style={{ background: "#00ec91" }} />
            </span>
            <span className="font-heading text-[10px] font-semibold tracking-[0.1em]" style={{ color: "#00ec91" }}>NETWORK LIVE</span>
            <span className="ml-auto font-heading text-[10px]" style={{ color: "#9ea0aa" }}>400 ms</span>
          </div>
        </div>

        <div className="mx-5 mb-4 h-px" style={{ background: "rgba(158,160,170,0.07)" }} />

        <nav className="flex flex-col gap-1 px-3">
          <p className="mb-1 px-2 font-heading text-[10px] font-semibold tracking-[0.12em] uppercase" style={{ color: "#9ea0aa" }}>Navigation</p>
          {sideNavItems.map(({ label, href, icon: Icon }) => {
            const isHome = href === "/";
            const isAnalyticsTab = href.includes("tab=analytics");
            const isEcosystemTab = href.includes("tab=ecosystem");
            const active = isHome 
              ? (pathname === "/" && activeTab === "terminal")
              : isAnalyticsTab 
                ? (pathname === "/" && activeTab === "analytics")
                : isEcosystemTab
                  ? (pathname === "/" && activeTab === "ecosystem")
                  : pathname === href;

            return (
              <Link
                key={label} href={href} onClick={onClose}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left font-heading text-sm font-medium tracking-wide transition-all"
                style={active ? { background: "rgba(153,69,255,0.12)", color: "#9945ff", borderLeft: "2px solid #9945ff" } : { color: "#9ea0aa" }}
              >
                <Icon className="size-4 shrink-0" />
                {label}
                {active && <span className="ml-auto rounded-full px-2 py-0.5 font-heading text-[9px] font-bold" style={{ background: "rgba(153,69,255,0.15)", color: "#9945ff" }}>ACTIVE</span>}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        <div className="flex items-center gap-2 px-5 pb-6">
          <button
            onClick={() => { onClose(); onOpenNotifications(); }}
            className="flex size-10 items-center justify-center rounded-xl transition-all hover:bg-white/5"
            style={{ background: "rgba(158,160,170,0.07)", color: "#9ea0aa" }}
          >
            <Bell className="size-4" />
          </button>
          <Link href="/settings"
            className="flex size-10 items-center justify-center rounded-xl transition-all hover:bg-white/5"
            style={pathname === "/settings" ? { background: "rgba(153,69,255,0.12)", color: "#9945ff" } : { background: "rgba(158,160,170,0.07)", color: "#9ea0aa" }}
          >
            <Settings className="size-4" />
          </Link>
          <Link href="/wallet/current" onClick={onClose}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 font-heading text-sm font-semibold tracking-wide transition-all hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg, #9945ff, #7c31e0)", color: "#f8f5ff" }}
          >
            <Wallet className="size-4" />
            Connect
          </Link>
        </div>
      </aside>
    </>
  );
}

/* ─────────────────────────────────────────────
   Top Bar
───────────────────────────────────────────── */
function TopBar({ onMenuOpen, onOpenNotifications }: { onMenuOpen: () => void; onOpenNotifications: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "terminal";

  return (
    <header className="relative z-40 flex items-center justify-between gap-4 rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5" style={{ background: "rgba(26,27,33,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
      <div className="flex items-center gap-3 lg:gap-7">
        <button onClick={onMenuOpen} className="flex size-9 items-center justify-center rounded-xl transition-all hover:bg-white/5 lg:hidden" style={{ color: "#9ea0aa" }}>
          <Menu className="size-5" />
        </button>

        <Link href="/" className="flex items-center gap-2">
          <div className="size-7 rounded-lg" style={{ background: "linear-gradient(135deg, #9945ff, #00ec91)" }} />
          <span className="font-heading text-base font-semibold lg:text-lg" style={{ color: "#ebecf0", letterSpacing: "0.18em" }}>SOLANA PULSE</span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm lg:flex">
          {sideNavItems.map(({ label, href }) => {
            const isHome = href === "/";
            const isAnalyticsTab = href.includes("tab=analytics");
            const isEcosystemTab = href.includes("tab=ecosystem");
            const active = isHome 
              ? (pathname === "/" && activeTab === "terminal")
              : isAnalyticsTab 
                ? (pathname === "/" && activeTab === "analytics")
                : isEcosystemTab
                  ? (pathname === "/" && activeTab === "ecosystem")
                  : pathname === href;

            return (
              <Link key={label} href={href} className="rounded-lg px-3 py-1.5 font-heading text-sm font-medium tracking-wide transition-all hover:bg-white/5" style={active ? { background: "rgba(153,69,255,0.12)", color: "#9945ff" } : { color: "#9ea0aa" }}>
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden h-9 items-center gap-2 rounded-xl px-3 text-sm md:flex focus-within:ring-1 focus-within:ring-[#9945ff]/50 transition-all duration-300 group" style={{ background: "#121318", color: "#9ea0aa" }}>
          <Search className="size-4 shrink-0 transition-colors group-focus-within:text-[#9945ff]" style={{ color: "#9945ff" }} />
          <input type="text" placeholder="Search accounts, programs, or transactions..." className="w-24 bg-transparent outline-none placeholder:text-[#9ea0aa]/70 lg:w-[280px] transition-all duration-300 focus:w-[320px]" />
        </div>

        <span className="flex items-center gap-1.5 rounded-full px-3 py-1 font-heading text-[10px] font-semibold tracking-[0.1em]" style={{ background: "rgba(0,236,145,0.10)", color: "#00ec91" }}>
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full opacity-75" style={{ background: "#00ec91" }} />
            <span className="relative inline-flex size-1.5 rounded-full" style={{ background: "#00ec91" }} />
          </span>
          <span className="hidden sm:block">LIVE</span>
        </span>

        <button onClick={onOpenNotifications} className="hidden size-9 items-center justify-center rounded-xl transition-all hover:bg-white/5 sm:flex" style={{ color: "#9ea0aa" }}>
          <Bell className="size-4" />
        </button>
        <Link href="/settings" className="hidden size-9 items-center justify-center rounded-xl transition-all hover:bg-white/5 sm:flex" style={pathname === "/settings" ? { background: "rgba(153,69,255,0.12)", color: "#9945ff" } : { color: "#9ea0aa" }}>
          <Settings className="size-4" />
        </Link>

        <Link href="/wallet/current" className="flex items-center gap-2 rounded-xl px-3 py-2 font-heading text-sm font-semibold tracking-wide transition-all hover:opacity-90 active:scale-95 sm:px-4" style={{ background: "linear-gradient(135deg, #9945ff, #7c31e0)", color: "#f8f5ff" }}>
          <Wallet className="size-4" />
          <span className="hidden sm:block">Connect Wallet</span>
        </Link>
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <div className="min-h-full" style={{ background: "#121318" }}>
      <Sidebar 
         open={sidebarOpen} 
         onClose={() => setSidebarOpen(false)} 
         onOpenNotifications={() => setNotificationsOpen(true)} 
      />
      <NotificationsModal 
         open={notificationsOpen} 
         onClose={() => setNotificationsOpen(false)} 
      />

      <main className="px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4">
          <TopBar 
             onMenuOpen={() => setSidebarOpen(true)} 
             onOpenNotifications={() => setNotificationsOpen(true)} 
          />
          {children}
        </div>
      </main>
    </div>
  );
}
