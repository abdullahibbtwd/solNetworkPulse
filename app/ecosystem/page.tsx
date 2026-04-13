"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EcosystemPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the unified dashboard ecosystem tab
    router.replace("/?tab=ecosystem");
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-[#121318]">
      <div className="flex flex-col items-center gap-4">
        <div className="size-10 animate-spin rounded-full border-4 border-[#9945ff] border-t-transparent" />
        <p className="font-heading text-sm font-semibold text-[#ebecf0]">Redirecting to Ecosystem Pulse...</p>
      </div>
    </div>
  );
}
