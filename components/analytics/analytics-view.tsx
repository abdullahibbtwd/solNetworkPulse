"use client";

import React, { useState, useEffect, useMemo, memo } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Activity, BarChart3, PieChart as PieChartIcon, TrendingUp, TrendingDown, Wallet } from "lucide-react";

/* ─────────────────────────────────────────────
   Constants & Utils
───────────────────────────────────────────── */
const COLORS = ["#9945ff", "#00ec91", "#ff4a8d", "#f5a524", "#9ea0aa"];

// Stable protocols for the 7-day chart to prevent jumping/flickering
const ANALYTICS_PROTOCOLS = ["Jupiter", "Raydium", "Pump.fun", "Meteora", "Orca"];

// Seeded historical data (Millions USD) - Static for session
const SEEDED_HISTORY = [
  { name: "Mon", Jupiter: 420, Raydium: 240, "Pump.fun": 85, Meteora: 120, Orca: 90 },
  { name: "Tue", Jupiter: 380, Raydium: 290, "Pump.fun": 110, Meteora: 140, Orca: 85 },
  { name: "Wed", Jupiter: 450, Raydium: 210, "Pump.fun": 145, Meteora: 110, Orca: 115 },
  { name: "Thu", Jupiter: 410, Raydium: 265, "Pump.fun": 190, Meteora: 130, Orca: 105 },
  { name: "Fri", Jupiter: 520, Raydium: 340, "Pump.fun": 220, Meteora: 155, Orca: 130 },
  { name: "Sat", Jupiter: 480, Raydium: 310, "Pump.fun": 185, Meteora: 145, Orca: 110 },
];

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface AnalyticsViewProps {
  worker?: Worker | null;
  liveVolume?: Record<string, number>;
  globalStats?: { totalVol: string; activeCount: number };
}

interface MarketToken {
  name: string;
  symbol: string;
  volume: string;
  trades: string;
  price: string;
  change: string;
  changeValue: number;
}

const MOCK_TOKENS: MarketToken[] = [
  { name: "Solana", symbol: "SOL", volume: "$2.4B", trades: "45.2k", price: "$142.64", change: "+4.2%", changeValue: 4.2 },
  { name: "Jupiter", symbol: "JUP", volume: "$840M", trades: "22.1k", price: "$1.12", change: "+2.1%", changeValue: 2.1 },
  { name: "Raydium", symbol: "RAY", volume: "$320M", trades: "12.5k", price: "$1.85", change: "-1.4%", changeValue: -1.4 },
  { name: "dogwithhat", symbol: "WIF", volume: "$180M", trades: "8.2k", price: "$2.45", change: "+8.5%", changeValue: 8.5 },
  { name: "Bonk", symbol: "BONK", volume: "$95M", trades: "15.8k", price: "$0.00002", change: "-2.3%", changeValue: -2.3 },
];

/* ─────────────────────────────────────────────
   Main View Component
───────────────────────────────────────────── */
export const AnalyticsView = memo(({
  worker,
  liveVolume = {},
  globalStats = { totalVol: "$0", activeCount: 0 }
}: AnalyticsViewProps) => {
  const [tokens, setTokens] = useState<MarketToken[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

  // 1. 7-Day Chart Data Construction (Uses persistent Dashboard state)
  const chartData = useMemo(() => {
    const today: any = { name: "Today" };
    ANALYTICS_PROTOCOLS.forEach(p => {
      // Map live session volume to the bar (scaled to Millions for the chart)
      today[p] = ((liveVolume?.[p]) || 0) / 1000000;
    });
    return [...SEEDED_HISTORY, today];
  }, [liveVolume]);

  // 2. Concentration Data (Pie)
  const pieData = useMemo(() => {
    return ANALYTICS_PROTOCOLS.map(name => ({
      name,
      value: (liveVolume?.[name]) || 10000 // Small fallback for visual balance
    })).sort((a, b) => b.value - a.value);
  }, [liveVolume]);

  // 3. Market Intelligence (CoinGecko)
  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const res = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=solana,jupiter-exchange-token,raydium,dogwithhat,bonk&order=market_cap_desc&per_page=5&page=1&sparkline=false&price_change_percentage=24h");
        if (!res.ok) throw new Error("API Rate Limit");
        const data = await res.json();

        if (Array.isArray(data)) {
          const mapped = data.map(coin => ({
            name: coin.name,
            symbol: coin.symbol.toUpperCase(),
            volume: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact" }).format(coin.total_volume),
            trades: (Math.random() * 50 + 20).toFixed(1) + "k",
            price: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(coin.current_price),
            change: (coin.price_change_percentage_24h || 0).toFixed(2) + "%",
            changeValue: coin.price_change_percentage_24h || 0
          }));
          setTokens(mapped);
        }
      } catch (e) {
        console.warn("CoinGecko Fetch Failed, using static analytics fallback", e);
        if (tokens.length === 0) setTokens(MOCK_TOKENS);
      }
    };

    fetchMarket();
    const interval = setInterval(fetchMarket, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* 7-DAY STABLE VOLUME CHART */}
      <GlassCard className="col-span-full lg:col-span-2">
        <div className="flex h-[400px] flex-col p-5">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="size-4" style={{ color: "#9945ff" }} />
              <div>
                <h2 className="font-heading text-lg font-semibold" style={{ color: "#ebecf0" }}>Protocol Volume (7D)</h2>
                <p className="font-sans text-[10px] uppercase tracking-wider" style={{ color: "#9ea0aa" }}>Persistent Session Data • Millions USD</p>
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-[300px]">
            {isVisible && (
              <ResponsiveContainer width="100%" height="100%" minHeight={300} debounce={50}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(158,160,170,0.06)" vertical={false} />
                  <XAxis dataKey="name" stroke="#9ea0aa" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#9ea0aa" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}M`} />
                  <Tooltip
                    contentStyle={{ background: "rgba(26,27,33,0.95)", border: "1px solid rgba(158,160,170,0.15)", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)" }}
                    itemStyle={{ fontSize: "12px", fontWeight: "600", fontFamily: "Space Grotesk" }}
                    formatter={(value: any) => [new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 }).format(Number(value) * 1000000), "Volume"]}
                  />
                  <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: "20px", fontSize: "11px" }} iconType="circle" />
                  {ANALYTICS_PROTOCOLS.map((name, i) => (
                    <Bar
                      key={name}
                      dataKey={name}
                      fill={COLORS[i % COLORS.length]}
                      radius={[4, 4, 0, 0]}
                      animationDuration={1500}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </GlassCard>

      {/* CONCENTRATION HEATMAP */}
      <GlassCard className="col-span-full lg:col-span-1">
        <div className="flex h-full flex-col p-5">
          <div className="mb-4 flex items-center gap-2">
            <PieChartIcon className="size-4" style={{ color: "#00ec91" }} />
            <h2 className="font-heading text-lg font-semibold" style={{ color: "#ebecf0" }}>Market Concentration</h2>
          </div>
          <div className="relative flex flex-1 items-center justify-center min-h-[250px]">
            {isVisible && (
              <ResponsiveContainer width="100%" height="100%" debounce={50}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact" }).format(Number(value || 0)), "Volume"]}
                    contentStyle={{ background: "rgba(26,27,33,0.95)", border: "1px solid rgba(158,160,170,0.15)", borderRadius: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-heading text-2xl font-bold tabular-nums" style={{ color: "#ebecf0" }}>{globalStats.totalVol}</span>
              <span className="font-heading text-[10px] tracking-wider uppercase" style={{ color: "#9ea0aa" }}>Session High</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {pieData.slice(0, 4).map((item, i) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="size-2 rounded-full" style={{ background: COLORS[i] }} />
                <span className="font-heading text-[10px] text-[#ebecf0] truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* ASSET INTELLIGENCE TABLE */}
      <GlassCard className="col-span-full">
        <div className="flex flex-col p-5">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="size-4" style={{ color: "#00ec91" }} />
              <h2 className="font-heading text-lg font-semibold" style={{ color: "#ebecf0" }}>High-Volume Assets</h2>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5">
              <TrendingUp className="size-3 text-[#00ec91]" />
              <span className="font-heading text-[10px] font-bold text-[#ebecf0]">Live Market Feed</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  {["Asset", "Price", "24h Volume", "Trades", "Performance"].map((h, i) => (
                    <th key={h} className={`pb-4 font-heading text-[10px] font-semibold tracking-wider uppercase ${i > 0 ? "text-right" : "text-left"}`} style={{ color: "#9ea0aa", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {tokens.map((token, idx) => (
                  <tr key={idx} className="group transition-all hover:bg-white/[0.02]">
                    <td className="py-4">
                      <div className="flex flex-col">
                        <span className="font-heading text-sm font-bold" style={{ color: "#ebecf0" }}>{token.name}</span>
                        <span className="font-sans text-[10px] uppercase font-bold" style={{ color: "#9ea0aa" }}>{token.symbol}</span>
                      </div>
                    </td>
                    <td className="py-4 text-right font-heading text-sm font-medium tabular-nums" style={{ color: "#ebecf0" }}>
                      {token.price}
                    </td>
                    <td className="py-4 text-right font-heading text-sm tabular-nums" style={{ color: "#ebecf0" }}>
                      {token.volume}
                    </td>
                    <td className="py-4 text-right font-heading text-sm tabular-nums" style={{ color: "#9ea0aa" }}>
                      {token.trades}
                    </td>
                    <td className="py-4 text-right">
                      <div className={`inline-flex items-center gap-1 rounded-full px-2 py-1 font-heading text-xs font-bold ${token.changeValue >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                        {token.changeValue >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                        {token.change}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </GlassCard>

    </div>
  );
});

AnalyticsView.displayName = "AnalyticsView";
