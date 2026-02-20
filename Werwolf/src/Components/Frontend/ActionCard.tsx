import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ActionCardProps = {
  icon: ReactNode;
  label: string;
  subtitle?: string;
  accentColor: string;
  glowColor: string;
  onClick?: () => void;
  delay?: number;
};

export default function ActionCard({ icon, label, subtitle, accentColor, glowColor, onClick, delay }: ActionCardProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative cursor-pointer select-none"
      style={{ perspective: "800px" }}
    >
      <motion.div
        animate={{ rotateX: hovered ? -4 : 0, scale: hovered ? 1.04 : 1 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-2xl border p-8 flex flex-col items-center gap-4 text-center"
        style={{
          background: "linear-gradient(145deg, rgba(15,10,25,0.95), rgba(25,15,40,0.9))",
          borderColor: hovered ? accentColor : "rgba(255,255,255,0.08)",
          boxShadow: hovered ? `0 0 50px -10px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.07)` : "inset 0 1px 0 rgba(255,255,255,0.04)",
          transition: "border-color 0.3s, box-shadow 0.3s",
        }}
      >
        {/* Corner ornaments */}
        {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos, i) => (
          <div key={i} className={`absolute ${pos} w-4 h-4 opacity-40`} style={{
            borderTop: i < 2 ? `1px solid ${accentColor}` : "none",
            borderBottom: i >= 2 ? `1px solid ${accentColor}` : "none",
            borderLeft: i % 2 === 0 ? `1px solid ${accentColor}` : "none",
            borderRight: i % 2 === 1 ? `1px solid ${accentColor}` : "none",
          }} />
        ))}

        {/* Shimmer */}
        <AnimatePresence>
          {hovered && (
            <motion.div initial={{ x: "-100%", opacity: 0 }} animate={{ x: "200%", opacity: 0.3 }}
                        exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
                        className="absolute inset-0 w-1/3 skew-x-12 pointer-events-none"
                        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}33, transparent)` }} />
          )}
        </AnimatePresence>

        {/* Icon */}
        <motion.div animate={{ filter: hovered ? `drop-shadow(0 0 16px ${accentColor})` : "none" }}
                    className="text-5xl mt-2">{icon}</motion.div>

        {/* Text */}
        <div>
          <h2 className="text-2xl font-bold tracking-widest uppercase mb-1"
              style={{ color: hovered ? accentColor : "#e8dcc8", fontFamily: "'Cinzel', Georgia, serif", transition: "color 0.3s" }}>
            {label}
          </h2>
          <p className="text-sm tracking-wide" style={{ color: "rgba(180,160,130,0.7)" }}>{subtitle}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

