import { Dashboard } from "@/components/dashboard/dashboard";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-[#09090b]">
        <div className="text-zinc-500 animate-pulse font-heading tracking-widest">LOADING PULSE DASHBOARD...</div>
      </div>
    }>
      <Dashboard />
    </Suspense>
  );
}