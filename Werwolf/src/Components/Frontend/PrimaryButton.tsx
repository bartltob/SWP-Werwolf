import { type ReactNode } from "react";
import { motion } from "framer-motion";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  accentHex?: string;
  glowRgba?: string;
  className?: string;
  compact?: boolean;
};

export default function PrimaryButton({ children, onClick, disabled, accentHex = "#9b59f5", glowRgba = "rgba(155,89,245,0.6)", className = "", compact = false }: Props) {
  const compactStyle: React.CSSProperties = compact
    ? { padding: '6px 10px', fontSize: '0.7rem', borderRadius: 12 }
    : { padding: '14px 16px' };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={`relative overflow-hidden rounded-xl text-sm font-bold uppercase tracking-[0.3em] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
      style={{
        ...compactStyle,
        background: `linear-gradient(135deg, rgba(15,10,25,1) 0%, rgba(25,15,40,1) 100%)`,
        border: `1px solid ${accentHex}88`,
        color: accentHex,
        boxShadow: disabled ? undefined : `0 0 30px -8px ${glowRgba}`,
        fontFamily: "'Cinzel', Georgia, serif",
      }}
    >
      {children}
    </motion.button>
  );
}
