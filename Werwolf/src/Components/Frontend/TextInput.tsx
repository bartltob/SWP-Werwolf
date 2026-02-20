import { type InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  focused?: boolean;
  accentHex?: string;
  glowSoft?: string;
};

export default function TextInput({ focused = false, accentHex = "#9b59f5", glowSoft = "rgba(155,89,245,0.2)", style, className = "", ...rest }: Props) {
  return (
    <input
      {...rest}
      className={`w-full px-5 py-4 text-base outline-none rounded-xl ${className}`}
      style={{
        ...(style as object),
        background: "rgba(6,4,16,0.8)",
        border: `1px solid ${focused ? accentHex : "rgba(255,255,255,0.08)"}`,
        boxShadow: focused ? `0 0 20px -5px ${glowSoft}, inset 0 1px 0 rgba(255,255,255,0.04)` : undefined,
        color: "#f5e6c8",
        fontFamily: "monospace",
        fontSize: "1.25rem",
        letterSpacing: "0.08em",
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}
    />
  );
}
