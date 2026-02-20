import { useState, useEffect } from "react";
import { Copy, LogOut, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase-config";
import { useRemovePlayer } from "../Hooks/useRemovePlayer.ts";
import Background from "../Components/Frontend/Background";
import HeaderBlock from "./Frontend/HeaderBlock";
import { Card, Divider, CornerOrnaments } from "./Frontend/Decorations";
import PrimaryButton from "../Components/Frontend/PrimaryButton";
import PlayerTile from "./Frontend/PlayerTile";

const redHex = "#e85d20";
const purpleHex = "#9b59f5";
const redGlow = "rgba(232,93,32,0.6)";
const purpleGlow = "rgba(155,89,245,0.6)";

export default function WaitingRoom() {
    const [roomKey, setRoomKey] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [players, setPlayers] = useState<any[]>([]);

    const playerId = sessionStorage.getItem("playerId");
    const currentPlayer = players.find((p) => String(p.id) === String(playerId)) || null;

    const { removePlayer } = useRemovePlayer();
    const navigate = useNavigate();

    useEffect(() => {
        if (!roomKey) return;
        const playersRef = ref(db, `rooms/${roomKey}/players`);
        const unsubscribe = onValue(playersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const playersArray = Object.entries(data).map(([id, value]: any) => ({ id, ...value }));
                setPlayers(playersArray);
            } else {
                setPlayers([]);
            }
        });
        return () => unsubscribe();
    }, [roomKey]);

    useEffect(() => {
        const key = sessionStorage.getItem("roomKey");
        if (key) setRoomKey(key);
        else navigate("/");
    }, [navigate]);

    const handleCopy = async () => {
        if (!roomKey) return;
        await navigator.clipboard.writeText(roomKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative w-full min-h-screen text-white flex items-center justify-center px-6 py-10 overflow-hidden"
             style={{ background: "#060410", fontFamily: "'Cinzel', Georgia, serif" }}>

            <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cinzel+Decorative:wght@700&display=swap');`}</style>

            <Background />

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-w-5xl"
            >
                {/* Use shared Card as the outer container; preserve grid layout via className */}
                <Card accentHex={purpleHex} glowRgba={purpleGlow} className="grid md:grid-cols-3 gap-8 relative overflow-hidden rounded-2xl p-8">
                    {/* Corner ornaments */}
                    <CornerOrnaments accentHex={purpleHex} />

                    {/* Top edge glow */}
                    <div className="absolute top-0 left-0 right-0 h-px"
                         style={{ background: `linear-gradient(90deg, transparent, ${purpleHex}55, transparent)` }} />

                    {/* ── LEFT: Player List ── */}
                    <div className="md:col-span-2 flex flex-col gap-6">

                        {/* Header */}
                        <div className="flex items-center gap-6">
                            <div style={{ flex: 1 }}>
                                <HeaderBlock
                                    icon={
                                        <motion.div
                                            animate={{ filter: [`drop-shadow(0 0 8px ${purpleHex})`, `drop-shadow(0 0 22px ${purpleHex})`, `drop-shadow(0 0 8px ${purpleHex})`] }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                            className="text-4xl leading-none select-none"
                                        >🌕</motion.div>
                                    }
                                    title={"The Lobby"}
                                    subtitle={"Gather your pack"}
                                    titleGradient={"linear-gradient(180deg, #e8d8ff 0%, #b57bf5 40%, #6a2fbf 100%)"}
                                    accentHex={purpleHex}
                                />
                            </div>

                            {/* Leave-Button */}
                            <PrimaryButton
                                onClick={() => removePlayer().then(() => navigate("/"))}
                                accentHex={purpleHex}
                                compact
                                className={"w-auto"}
                            >
                                <div className="flex items-center gap-2"><LogOut size={12} /> Leave</div>
                            </PrimaryButton>
                        </div>

                        {/* Divider */}
                        <Divider accentHex={purpleHex} />

                        {/* Player count */}
                        <p className="text-xs tracking-[0.3em] uppercase" style={{ color: "rgba(155,89,245,0.6)" }}>
                            {players.length} {players.length === 1 ? "soul" : "souls"} in the room
                        </p>

                        {/* Player grid */}
                        <div className="grid sm:grid-cols-2 gap-3">
                            {players.map((player, i) => (
                                <PlayerTile
                                    key={player.id}
                                    id={player.id}
                                    nickname={player.nickname}
                                    host={player.host}
                                    isYou={String(player.id) === String(playerId)}
                                    index={i}
                                    redHex={redHex}
                                    purpleHex={purpleHex}
                                    redGlow={redGlow}
                                />
                            ))}

                            {/* Empty slots hint */}
                            {players.length < 2 && (
                                <motion.div
                                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="flex items-center justify-center px-4 py-3 rounded-xl"
                                    style={{ border: "1px solid rgba(150,150,200,0.8)", color: "rgba(255,255,200)", fontSize: "0.75rem", letterSpacing: "0.2em" }}
                                >
                                    Waiting for players...
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* ── RIGHT: Room Code + Start ── */}
                    <div className="flex flex-col justify-between gap-6">

                        {/* Room code panel — use purple accent instead of red */}
                        <Card accentHex={purpleHex} glowRgba={purpleGlow}>
                            <CornerOrnaments accentHex={purpleHex} />

                            <p className="text-sm tracking-[0.3em] uppercase" style={{ color: "rgba(200,200,200)" }}>
                                Room Code
                            </p>

                            <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: "rgba(0,0,0,0.4)", border: `1px solid ${purpleHex}33` }}>
                                <span className="tracking-[0.4em] font-mono text-xl" style={{ color: "#f5e6c8" }}>{roomKey}</span>
                                <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} onClick={handleCopy} style={{ color: copied ? purpleHex : "rgba(155,89,245,0.7)" }} className="transition-colors duration-300">
                                    {copied ? <Check size={18} /> : <Copy size={18} />}
                                </motion.button>
                            </div>

                            {copied && (
                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs text-center tracking-widest" style={{ color: purpleHex }}>
                                    Copied to clipboard
                                </motion.p>
                            )}

                            <p className="text-xs tracking-wide text-center" style={{ color: "rgba(200,200,200,0.35)", fontStyle: "italic" }}>
                                Share this code with your pack
                            </p>
                        </Card>

                        {/* Start button */}
                        <PrimaryButton onClick={() => { /* TODO: Spielstart-Logik */ }} disabled={!currentPlayer?.host} accentHex={redHex} className={"w-full py-4 text-lg"}>
                            {currentPlayer?.host ? "Begin the Hunt →" : "Awaiting Host..."}
                        </PrimaryButton>

                        {/* Footer */}
                        <p className="text-center text-xs tracking-[0.3em] uppercase" style={{ color: "rgba(200,200,200,0.4)", fontStyle: "italic" }}>
                            ⚔ the hunt begins ⚔
                        </p>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}