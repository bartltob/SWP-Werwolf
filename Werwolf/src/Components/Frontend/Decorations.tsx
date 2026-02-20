import { type ReactNode } from "react";

export function CornerOrnaments({ accentHex = "#9b59f5" }: { accentHex?: string }) {
  return (
    <>
      {[
        "top-3 left-3 border-t border-l",
        "top-3 right-3 border-t border-r",
        "bottom-3 left-3 border-b border-l",
        "bottom-3 right-3 border-b border-r",
      ].map((cls, i) => (
        <div key={i} className={`absolute ${cls} w-5 h-5`} style={{ borderColor: `${accentHex}88` }} />
      ))}
    </>
  );
}

export function CharCount({ count }: { count: number }) {
  return (
    <span className="absolute right-4 bottom-3 text-xs" style={{ color: "rgba(140,100,60,0.5)", fontFamily: "monospace" }}>{count}/20</span>
  );
}

// --- Card (presentational wrapper)
export function Card({ children, accentHex = "#9b59f5", glowRgba = "rgba(155,89,245,0.6)", className = "" }: { children: ReactNode; accentHex?: string; glowRgba?: string; className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-8 flex flex-col gap-7 ${className}`}
      style={{
        background: "linear-gradient(145deg, rgba(12,8,22,0.97), rgba(20,12,35,0.95))",
        border: `1px solid ${accentHex}55`,
        boxShadow: `0 0 60px -15px ${glowRgba}, inset 0 1px 0 rgba(255,255,255,0.06)`,
      }}
    >
      {children}
    </div>
  );
}

// --- Divider (ornamental)
export function Divider({ accentHex = "#9b59f5", children }: { accentHex?: string; children?: ReactNode }) {
  return (
    <div className="flex items-center gap-3 opacity-80">
      <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accentHex})` }} />
      <span className="text-xs" style={{ color: accentHex }}>{children ?? '✦'}</span>
      <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${accentHex}, transparent)` }} />
    </div>
  );
}

// --- OrnamentalDivider (preconfigured divider with amber color)
export function OrnamentalDivider() {
  return (
    <div className="flex items-center gap-3 w-full max-w-xs mx-auto my-2 opacity-40">
      <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, #c8901a)" }} />
      <span className="text-amber-600 text-xs">✦</span>
      <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, #c8901a, transparent)" }} />
    </div>
  );
}
