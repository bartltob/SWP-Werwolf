import { motion } from "framer-motion";
import { Crown } from "lucide-react";

type Props = {
  id: string | number;
  nickname: string;
  host?: boolean;
  isYou?: boolean;
  index?: number;
  redHex?: string;
  purpleHex?: string;
  redGlow?: string;
};

export default function PlayerTile({ id, nickname, host, isYou, index = 0, redHex = "#e85d20", purpleHex = "#9b59f5", redGlow = "rgba(232,93,32,0.6)" }: Props) {
  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="relative flex items-center justify-between px-4 py-3 rounded-xl overflow-hidden"
      style={{
        background: "rgba(6,4,16,0.7)",
        border: `1px solid ${host ? redHex + "55" : purpleHex + "33"}`,
        boxShadow: host ? `0 0 20px -8px ${redGlow}` : "none",
      }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l" style={{ background: host ? redHex : purpleHex, opacity: 0.7 }} />

      <span className="text-sm tracking-widest pl-2" style={{ color: "#f5e6c8" }}>{nickname}</span>

      <div className="flex items-center gap-2">
        {host && (
          <span className="flex items-center gap-1 text-xs tracking-widest uppercase" style={{ color: redHex, fontFamily: "'Cinzel', Georgia, serif" }}>
            <Crown size={12} /> Host
          </span>
        )}
        {isYou && !host && (
          <span className="text-xs tracking-widest" style={{ color: "rgba(155,89,245,0.6)" }}>You</span>
        )}
      </div>
    </motion.div>
  );
}

