import { type ReactNode } from "react";
import { motion } from "framer-motion";

type Props = {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  titleGradient?: string;
  accentHex?: string;
};

export default function HeaderBlock({ icon, title, subtitle, titleGradient, accentHex = "#9b59f5" }: Props) {
  return (
    <div className="flex items-center gap-4">
      <motion.div
        animate={{ filter: [`drop-shadow(0 0 8px ${accentHex})`, `drop-shadow(0 0 20px ${accentHex})`, `drop-shadow(0 0 8px ${accentHex})`] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="text-5xl leading-none select-none"
      >
        {icon}
      </motion.div>

      <div>
        <h1 className="text-4xl font-black uppercase"
            style={{
              fontFamily: "'Cinzel Decorative', Georgia, serif",
              background: titleGradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "0.08em"
            }}>
          {title}
        </h1>
        {subtitle && <p className="text-xs tracking-[0.25em] uppercase mt-1" style={{ color: "rgba(180,140,80,0.55)" }}>{subtitle}</p>}
      </div>
    </div>
  );
}
