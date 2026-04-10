import React from "react";

export function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{
        background:
          "linear-gradient(180deg, rgba(158,160,170,0.13) 0%, rgba(30,31,37,0.97) 100%)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        transform: "translateZ(0)",
        willChange: "backdrop-filter, transform",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(158,160,170,0.25) 40%, rgba(153,69,255,0.3) 60%, transparent)",
        }}
      />
      {children}
    </div>
  );
}
