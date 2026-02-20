import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SetNickname from "../Components/SetNickname";
import Background from "../Components/Frontend/Background";
import ActionCard from "../Components/Frontend/ActionCard";
import { OrnamentalDivider } from "../Components/Frontend/Decorations";

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function MainPage() {
    const navigate = useNavigate();
    const [showNickname, setShowNickname] = useState(false);
    const [titleGlow, setTitleGlow] = useState(false);

    // keep hooks at the top so their order is stable across renders
    useEffect(() => {
        const interval = setInterval(() => setTitleGlow(g => !g), 3000);
        return () => clearInterval(interval);
    }, []);

    if (showNickname) return <SetNickname newRoom={true} />;

    return (
        <div className="relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-center px-6 py-6"
             style={{ background: "#060410", fontFamily: "'Cinzel', Georgia, serif" }}>

            {/* Google Font */}
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cinzel+Decorative:wght@700&display=swap');`}</style>

            {/* Background (moved to component) */}
            <Background />

            {/* Content */}
            <div className="relative z-20 flex flex-col items-center w-full max-w-2xl gap-6 md:gap-8">

                {/* Wolf icon */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <motion.div
                        animate={{ filter: ["drop-shadow(0 0 20px rgba(200,80,0,0.6))", "drop-shadow(0 0 45px rgba(255,120,0,0.9))", "drop-shadow(0 0 20px rgba(200,80,0,0.6))"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="text-7xl text-center leading-none"
                    >
                        {/* slightly smaller on md to avoid overflow */}
                        <img src="/werewolf.png" alt="Wolf Icon" className="w-16 h-16 md:w-24 md:h-24" />
                    </motion.div>
                </motion.div>

                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-center"
                >
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-widest leading-tight"
                        style={{
                            fontFamily: "'Cinzel Decorative', Georgia, serif",
                            background: "linear-gradient(180deg, #fff8dc 0%, #f5c842 30%, #c8701a 65%, #7a3500 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            textShadow: "none",
                            filter: titleGlow ? "drop-shadow(0 0 30px rgba(255,150,30,0.8))" : "drop-shadow(0 0 10px rgba(200,100,0,0.4))",
                            transition: "filter 2s ease-in-out",
                        }}>
                        Werewolf
                    </h1>
                    <h2 className="text-lg md:text-2xl tracking-[0.4em] uppercase mt-1"
                        style={{ color: "rgba(200,150,80,0.7)", letterSpacing: "0.35em" }}>
                        Online
                    </h2>
                </motion.div>

                {/* Tagline */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 1 }}
                    className="text-center"
                >
                    <OrnamentalDivider />
                    <p className="text-xs tracking-[0.35em] uppercase mt-3"
                       style={{ color: "rgba(180,130,80,0.6)", fontFamily: "Georgia, serif", fontStyle: "italic" }}>
                        Deceive · Survive · Unmask
                    </p>
                    <OrnamentalDivider />
                </motion.div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-3">
                    <ActionCard
                        icon="🔥"
                        label="Create Room"
                        subtitle="Forge a new game and summon your pack"
                        accentColor="#e85d20"
                        glowColor="rgba(232,93,32,0.7)"
                        onClick={() => setShowNickname(true)}
                        delay={0.8}
                    />
                    <ActionCard
                        icon="🌙"
                        label="Join Game"
                        subtitle="Enter the shadows with a secret code"
                        accentColor="#9b59f5"
                        glowColor="rgba(155,89,245,0.7)"
                        onClick={() => navigate("/JoinRoom")}
                        delay={1.0}
                    />
                </div>

                {/* Footer rune line */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                    className="text-xs tracking-[0.35em] uppercase mt-4"
                    style={{ color: "rgba(120,90,60,0.4)", fontFamily: "Georgia, serif" }}
                >
                    ⚔ the hunt begins at moonrise ⚔
                </motion.p>
            </div>
        </div>
    );
}