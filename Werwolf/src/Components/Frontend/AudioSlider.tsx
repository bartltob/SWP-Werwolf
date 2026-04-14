import { motion } from "framer-motion";
import { useSettings } from "../../Components/Frontend/SettingsContext";
export default function AudioSlider() {
  const { uiVolume, setUiVolume } = useSettings();

  const isMuted = uiVolume === 0;

  const volumeIcon = isMuted
    ? "🔇"
    : uiVolume < 0.4
      ? "🔈"
      : uiVolume < 0.75
        ? "🔉"
        : "🔊";

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl"
      style={{
        background: "rgba(15,10,25,0.85)",
        border: "1px solid rgba(155,89,245,0.25)",
        boxShadow: "0 0 20px -8px rgba(155,89,245,0.3)",
        fontFamily: "'Cinzel', Georgia, serif",
        minWidth: 220,
      }}
    >
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={() => setUiVolume(isMuted ? 0.5 : 0)}
        className="text-xl select-none focus:outline-none"
        title={isMuted ? "Ton an" : "Stummschalten"}
        style={{ lineHeight: 1 }}
      >
        {volumeIcon}
      </motion.button>
      <div className="relative flex-1 flex items-center" style={{ height: 20 }}>
        <div
          className="absolute w-full rounded-full"
          style={{
            height: 4,
            background: "rgba(255,255,255,0.08)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            height: 4,
            width: `${uiVolume * 100}%`,
            background:
              "linear-gradient(90deg, rgba(155,89,245,0.5), rgba(155,89,245,1))",
            boxShadow: isMuted ? "none" : "0 0 8px rgba(155,89,245,0.7)",
            transition: "width 0.05s",
          }}
        />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={uiVolume}
          onChange={(e) => setUiVolume(parseFloat(e.target.value))}
          className="absolute w-full opacity-0 cursor-pointer"
          style={{ height: 20 }}
          aria-label="UI-Lautstärke"
        />
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 14,
            height: 14,
            left: `calc(${uiVolume * 100}% - 7px)`,
            background: "#9b59f5",
            boxShadow: "0 0 10px rgba(155,89,245,0.9)",
            transition: "left 0.05s",
          }}
          whileHover={{ scale: 1.3 }}
        />
      </div>
      <span
        className="text-xs tabular-nums select-none"
        style={{
          color: "rgba(155,89,245,0.6)",
          minWidth: 30,
          textAlign: "right",
        }}
      >
        {Math.round(uiVolume * 100)}%
      </span>
    </div>
  );
}
