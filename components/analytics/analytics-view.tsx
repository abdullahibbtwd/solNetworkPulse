"use client";

import { GlassCard } from "@/components/ui/glass-card";
import {
  LineChart,
  Line,
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
import { Activity, ArrowUpRight, BarChart3, PieChart as PieChartIcon } from "lucide-react";

/* ─────────────────────────────────────────────
   Mock Data for Charts
───────────────────────────────────────────── */
const volumeData = [
  { name: "Mon", Jupiter: 400, Raydium: 240, Orca: 120 },
  { name: "Tue", Jupiter: 300, Raydium: 139, Orca: 100 },
  { name: "Wed", Jupiter: 500, Raydium: 380, Orca: 150 },
  { name: "Thu", Jupiter: 450, Raydium: 390, Orca: 200 },
  { name: "Fri", Jupiter: 600, Raydium: 480, Orca: 250 },
  { name: "Sat", Jupiter: 800, Raydium: 520, Orca: 300 },
  { name: "Sun", Jupiter: 750, Raydium: 430, Orca: 280 },
];

const tokenDistribution = [
  { name: "SOL", value: 45 },
  { name: "JUP", value: 25 },
  { name: "RAY", value: 15 },
  { name: "BONK", value: 10 },
  { name: "Other", value: 5 },
];

const topTokens = [
  { name: "SOL", volume: "$450M", trades: "120k", price: "$142.64", change: "+2.8%" },
  { name: "JUP", volume: "$180M", trades: "85k", price: "$1.12", change: "+5.4%" },
  { name: "RAY", volume: "$120M", trades: "62k", price: "$1.85", change: "-1.2%" },
  { name: "WIF", volume: "$85M", trades: "45k", price: "$2.40", change: "+12.1%" },
  { name: "BONK", volume: "$70M", trades: "90k", price: "$0.000021", change: "+3.2%" },
];

const whaleWallets = [
  { address: "7xR...9wL", volume: "$4.2M", trades: 14, primary: "Jupiter" },
  { address: "H4p...K3S", volume: "$2.9M", trades: 8, primary: "Raydium" },
  { address: "Bin...001", volume: "$1.8M", trades: 45, primary: "Native" },
  { address: "Dge...666", volume: "$1.2M", trades: 3, primary: "Orca" },
];

const COLORS = ["#9945ff", "#00ec91", "#de3337", "#f5a524", "#9ea0aa"];

/* ─────────────────────────────────────────────
   Custom Recharts Tooltip
───────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-xl px-4 py-3"
        style={{
          background: "rgba(26,27,33,0.9)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(158,160,170,0.15)",
        }}
      >
        <p className="mb-2 font-heading text-xs font-bold" style={{ color: "#ebecf0" }}>
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <span className="font-sans text-xs" style={{ color: entry.color }}>
              {entry.name}
            </span>
            <span className="font-heading text-sm font-semibold tabular-nums" style={{ color: "#ebecf0" }}>
              ${entry.value}M
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

/* ─────────────────────────────────────────────
   Components
───────────────────────────────────────────── */
function VolumeTrendsChart() {
  return (
    <GlassCard className="col-span-full lg:col-span-2">
      <div className="flex h-[320px] flex-col p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="size-4" style={{ color: "#9945ff" }} />
            <h2 className="font-heading text-lg font-semibold" style={{ color: "#ebecf0" }}>
              Protocol Volume Comparison
            </h2>
          </div>
          <span className="font-heading text-[10px] tracking-[0.1em] uppercase" style={{ color: "#9ea0aa" }}>
            Last 7 Days (Millions)
          </span>
        </div>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={volumeData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(158,160,170,0.06)" vertical={false} />
              <XAxis dataKey="name" stroke="#9ea0aa" fontSize={11} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#9ea0aa" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(158,160,170,0.04)" }} />
              <Legend wrapperStyle={{ paddingTop: "20px", fontSize: "11px", color: "#9ea0aa" }} iconType="circle" />
              <Bar dataKey="Jupiter" fill="#9945ff" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Raydium" fill="#00ec91" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Orca" fill="#de3337" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </GlassCard>
  );
}

function TokenVolumeTable() {
  return (
    <GlassCard className="col-span-full lg:col-span-2">
      <div className="flex flex-col p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold" style={{ color: "#ebecf0" }}>
            Top Tokens (24h)
          </h2>
          <span className="cursor-pointer font-heading text-xs font-semibold" style={{ color: "#9945ff" }}>
            View Full List →
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr>
                {["Token", "Volume", "Trades", "Price", "24h Chg"].map((h, i) => (
                  <th
                    key={h}
                    className={`pb-3 font-heading text-[10px] font-semibold tracking-[0.08em] uppercase ${i > 0 ? "text-right" : "text-left"}`}
                    style={{ color: "#9ea0aa", borderBottom: "1px solid rgba(158,160,170,0.1)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topTokens.map((token, idx) => (
                <tr key={idx} className="transition-all hover:bg-white/5">
                  <td className="py-3.5 pr-4 font-heading text-sm font-semibold" style={{ color: "#ebecf0" }}>{token.name}</td>
                  <td className="py-3.5 pr-4 text-right font-heading text-sm tabular-nums" style={{ color: "#ebecf0" }}>{token.volume}</td>
                  <td className="py-3.5 pr-4 text-right font-heading text-sm tabular-nums" style={{ color: "#9ea0aa" }}>{token.trades}</td>
                  <td className="py-3.5 pr-4 text-right font-heading text-sm tabular-nums" style={{ color: "#ebecf0" }}>{token.price}</td>
                  <td className="py-3.5 text-right font-heading text-sm font-semibold tabular-nums" style={{ color: token.change.startsWith("+") ? "#00ec91" : "#de3337" }}>
                    {token.change}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </GlassCard>
  );
}

function WhaleWalletsList() {
  return (
    <GlassCard className="col-span-full lg:col-span-1">
      <div className="flex h-full flex-col p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="size-4" style={{ color: "#00ec91" }} />
            <h2 className="font-heading text-lg font-semibold" style={{ color: "#ebecf0" }}>Top Whales (24h)</h2>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-3">
          {whaleWallets.map((wallet, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-xl p-3 transition-all hover:bg-white/5"
              style={{ background: "rgba(158,160,170,0.05)" }}
            >
              <div>
                <p className="font-heading text-sm font-semibold tracking-wide" style={{ color: "#ebecf0" }}>
                  {wallet.address}
                </p>
                <p className="font-sans text-xs" style={{ color: "#9ea0aa" }}>
                  Prefers {wallet.primary}
                </p>
              </div>
              <div className="text-right">
                <p className="font-heading text-sm font-bold tabular-nums" style={{ color: "#00ec91" }}>
                  {wallet.volume}
                </p>
                <p className="font-sans text-xs tabular-nums" style={{ color: "#9ea0aa" }}>{wallet.trades} trades</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

function TokenPieChart() {
  return (
    <GlassCard className="col-span-full lg:col-span-1">
      <div className="flex h-full flex-col p-5">
        <div className="mb-4 flex items-center gap-2">
          <PieChartIcon className="size-4" style={{ color: "#9945ff" }} />
          <h2 className="font-heading text-lg font-semibold" style={{ color: "#ebecf0" }}>Global Market Share</h2>
        </div>
        <div className="relative flex flex-1 items-center justify-center min-h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={tokenDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {tokenDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "rgba(26,27,33,0.9)", border: "none", borderRadius: "12px", color: "#ebecf0" }}
                itemStyle={{ color: "#ebecf0" }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Centered label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
             <span className="font-heading text-2xl font-bold tabular-nums" style={{ color: "#ebecf0" }}>$2.4B</span>
             <span className="font-heading text-[10px] tracking-wider uppercase" style={{ color: "#9ea0aa" }}>Total Vol</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

export function AnalyticsView() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Top Row: Stacked Bar Chart & Pie Chart */}
      <VolumeTrendsChart />
      <TokenPieChart />
      
      {/* Bottom Row: Table & Whale List */}
      <TokenVolumeTable />
      <WhaleWalletsList />
    </div>
  );
}
