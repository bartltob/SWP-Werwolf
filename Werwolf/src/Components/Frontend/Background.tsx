import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Background() {
  return (
    <>
      {/* Deep background layers */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Vignette */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, rgba(0,0,0,0.8) 100%)" }} />
        {/* Ground glow */}
        <div className="absolute bottom-0 left-0 right-0 h-64" style={{ background: "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(180,40,10,0.18), transparent)" }} />
        {/* Purple haze */}
        <div className="absolute top-0 left-0 right-0 h-80" style={{ background: "radial-gradient(ellipse 60% 80% at 50% 0%, rgba(60,20,100,0.35), transparent)" }} />
        {/* Side darkness */}
        <div className="absolute left-0 top-0 bottom-0 w-32" style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.6), transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-32" style={{ background: "linear-gradient(-90deg, rgba(0,0,0,0.6), transparent)" }} />
      </div>

      <Particles />
      <Moon />
      <RuneBorder />
      <SettingsButton />
    </>
  );
}

function Particles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: -(Math.random() * 0.5 + 0.1),
      alpha: Math.random(),
      flicker: Math.random() * 0.02 + 0.005,
      color: Math.random() > 0.5 ? "255,160,40" : "220,80,30",
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        p.alpha += p.flicker * (Math.random() > 0.5 ? 1 : -1);
        p.alpha = Math.max(0.05, Math.min(0.9, p.alpha));
        if (p.y < -5) {
          p.y = H + 5;
          p.x = Math.random() * W;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
}

function Moon() {
  return (
    <div className="absolute top-8 right-12 z-10 pointer-events-none select-none">
      <motion.div
        animate={{ boxShadow: ["0 0 60px 20px rgba(255,220,120,0.25)", "0 0 100px 40px rgba(255,200,80,0.45)", "0 0 60px 20px rgba(255,220,120,0.25)"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="w-28 h-28 rounded-full"
        style={{ background: "radial-gradient(circle at 38% 35%, #fff8dc, #f5d060 40%, #c8901a 80%, #5a3800)" }}
      />
      {/* cloud wisps */}
      <motion.div
        animate={{ x: [0, 18, 0], opacity: [0.18, 0.28, 0.18] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-2 -left-8 w-20 h-6 rounded-full blur-md"
        style={{ background: "rgba(20,10,40,0.7)" }}
      />
    </div>
  );
}

const RUNES = "ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ";
function RuneBorder() {
  const runes = Array.from({ length: 32 }, (_, i) => RUNES[i % RUNES.length]);
  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex items-stretch">
      {/* Left */}
      <div className="absolute left-3 top-1/4 bottom-1/4 flex flex-col justify-around opacity-20">
        {runes.slice(0, 12).map((r, i) => (
          <motion.span key={i} animate={{ opacity: [0.15, 0.5, 0.15] }}
            transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
            className="text-amber-300 text-xs font-mono">
            {r}
          </motion.span>
        ))}
      </div>
      {/* Right */}
      <div className="absolute right-3 top-1/4 bottom-1/4 flex flex-col justify-around opacity-20">
        {runes.slice(12, 24).map((r, i) => (
          <motion.span key={i} animate={{ opacity: [0.15, 0.5, 0.15] }}
            transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.15 }}
            className="text-amber-300 text-xs font-mono">
            {r}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

function SettingsButton() {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="absolute top-5 right-5 z-30 w-10 h-10 flex items-center justify-center rounded-full border"
      style={{
        borderColor: hovered ? "#c8901a" : "rgba(255,255,255,0.1)",
        background: "rgba(10,5,20,0.8)",
        backdropFilter: "blur(8px)",
        boxShadow: hovered ? "0 0 20px rgba(200,144,26,0.5)" : "none",
        transition: "all 0.3s",
      }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.span animate={{ rotate: hovered ? 90 : 0 }} transition={{ duration: 0.4 }}
        className="text-base" style={{ color: hovered ? "#c8901a" : "#888" }}>⚙</motion.span>
    </motion.button>
  );
}
