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
import { useChatStore, CHAT_WIDTH } from "../store/chatStore";
import {socket} from "../socket.ts";
import Sidebar from "./Sidebar.tsx";
import {useIconStore} from "../store/iconStore.ts";


const redHex = "#e85d20";
const purpleHex = "#9b59f5";
const redGlow = "rgba(232,93,32,0.6)";
const purpleGlow = "rgba(155,89,245,0.6)";

export default function WaitingRoom() {
    const [roomKey, setRoomKey] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [players, setPlayers] = useState<any[]>([]);
    const [joined, setJoined] = useState(false);
    const [distribution, setDistribution] = useState<Record<string, number>>({});
    const { collapsed } = useChatStore();
    const [OpenSettingsTrigger, setOpenSettingsTrigger] = useState<number>(0);
    const {icons} = useIconStore();


    const playerId = sessionStorage.getItem("playerId");
    const currentPlayer = players.find((p) => String(p.id) === String(playerId)) || null;
    console.log("Current Player:", currentPlayer);

    const { removePlayer } = useRemovePlayer({ roomKey: roomKey ?? "", playerId: playerId ?? "" });
    const navigate = useNavigate();

    useEffect(() => {
        if (!roomKey) return;
        const playersRef = ref(db, `rooms/${roomKey}/players`);
        const unsubscribe = onValue(playersRef, (snapshot) => {
            const data = snapshot.val();

            if (!data) {
                // Raum wurde gelöscht
                sessionStorage.clear();
                navigate("/");
                return;
            }

            const currentPlayerId = sessionStorage.getItem("playerId");
            if (currentPlayerId && !data[currentPlayerId]) {
                // Eigener Spieler wurde gekickt oder vom Server entfernt
                sessionStorage.clear();
                navigate("/");
                return;
            }

            const playersArray = Object.entries(data).map(([id, value]: any) => ({ id, ...value }));
            setPlayers(playersArray);
        });
        return () => unsubscribe();
    }, [roomKey, navigate]);



    useEffect(() => {
        if (!roomKey || joined || !currentPlayer) return;

        socket.emit("joinRoom", {
            roomId: roomKey,
            name:currentPlayer?.nickname || "Unknown",
            playerId
        });

        setJoined(true);
    }, [roomKey,currentPlayer,joined]);

    useEffect(() => {
        const key = sessionStorage.getItem("roomKey");
        if (key) setRoomKey(key);
        else navigate("/");
    }, [navigate]);

    useEffect(() => {
        return () => {
            // This fires on back button, route change, anything that unmounts this component
            socket.emit("leaveRoom", { roomId: roomKey, targetPlayerId: playerId });
        };
    }, [roomKey]);

    // Im ersten useEffect (joinRoom) den socket listener ergänzen
    useEffect(() => {
        socket.on("cardDistributionUpdate", (dist) => setDistribution(dist));
        return () => { socket.off("cardDistributionUpdate"); };
    }, []);

    const handleCopy = async () => {
        if (!roomKey) return;
        await navigator.clipboard.writeText(roomKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    function handelLeave() {
        removePlayer().then(() => navigate("/"));
        socket.emit("leaveRoom", { roomId: roomKey, targetPlayerId: playerId });
    }


    return (
        <motion.div
            className="relative w-full min-h-screen text-white flex items-center justify-center px-6 py-10 overflow-hidden"
            animate={{ paddingRight: collapsed ? "1.5rem" : `calc(1.5rem + ${CHAT_WIDTH}px)` }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
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
                                onClick={() => (handelLeave()
                                )}
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
                                    playerID={player.id}
                                    nickname={player.nickname}
                                    roomKey={roomKey || undefined}
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
                    <div className="flex flex-col gap-4 h-full">

                        {/* Room code — mini bar */}
                        <div className="flex items-center justify-between px-4 py-2.5 rounded-xl"
                             style={{ background: "rgba(0,0,0,0.35)", border: `1px solid ${purpleHex}33` }}>
                            <div className="flex items-center gap-3">
            <span className="text-xs tracking-[0.25em] uppercase"
                  style={{ color: "rgba(155,89,245,0.5)" }}>Code</span>
                                <span className="font-mono text-sm tracking-[0.35em]"
                                      style={{ color: "#f5e6c8" }}>{roomKey}</span>
                            </div>
                            <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                                           onClick={handleCopy}
                                           style={{ color: copied ? purpleHex : "rgba(155,89,245,0.5)" }}
                                           className="transition-colors duration-300 ml-2">
                                {copied ? <Check size={13} /> : <Copy size={13} />}
                            </motion.button>
                        </div>

                        {/* Roles panel — fixed height, scrollable */}
                        <div className="relative rounded-2xl flex flex-col overflow-hidden"
                             style={{ border: `1px solid ${purpleHex}25`, background: "rgba(15,8,35,0.7)", flex: 1 ,cursor:"pointer"}}
                        onClick={() => setOpenSettingsTrigger(prev => prev + 1)}>

                            <div className="absolute top-0 left-0 right-0 h-px"
                                 style={{ background: `linear-gradient(90deg, transparent, ${purpleHex}55, transparent)` }} />
                            <CornerOrnaments accentHex={purpleHex} />

                            <div className="px-4 pt-4 pb-2 shrink-0">
                                <p className="text-xs tracking-[0.3em] uppercase" style={{ color: "rgba(155,89,245,0.6)" }}>
                                    ⚔ Roles in play
                                </p>
                                <div className="mt-2 h-px" style={{ background: `linear-gradient(90deg, ${purpleHex}44, transparent)` }} />
                            </div>

                            <div className="flex flex-col gap-1.5 px-4 pb-4 overflow-y-auto"
                                 style={{ scrollbarWidth: "thin", scrollbarColor: `${purpleHex}44 transparent` }}>
                                {Object.entries(distribution)
                                    .filter(([, count]) => count > 0)
                                    .map(([role, count]) => {
                                        const isWolf = role === "Werewolf";
                                        const accent = isWolf ? redHex : purpleHex;
                                        return (
                                            <motion.div
                                                key={role}
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="flex items-center justify-between px-3 py-2 rounded-lg"
                                                style={{ background: "rgba(0,0,0,0.25)", border: `1px solid ${accent}22`, flexShrink: 0 }}
                                            >
                                                <span className="text-sm mr-2">{icons[role] ?? "❓"}</span>
                                                <span className="flex-1 text-xs tracking-[0.12em] uppercase"
                                                      style={{ color: "rgba(235,215,255,0.85)" }}>
                                {role}
                            </span>
                                                <span className="text-xs font-bold px-2 py-0.5 rounded-md min-w-[24px] text-center"
                                                      style={{ color: accent, background: `${accent}18`, border: `1px solid ${accent}33` }}>
                                {count}
                            </span>
                                            </motion.div>
                                        );
                                    })}

                                {Object.values(distribution).every(c => c === 0) && (
                                    <p className="text-xs text-center py-4 tracking-widest italic"
                                       style={{ color: "rgba(200,200,200,0.2)" }}>
                                        Waiting for players...
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Start button */}
                        <PrimaryButton
                            onClick={() => { socket.emit("startGame", roomKey); }}
                            disabled={!currentPlayer?.host}
                            accentHex={redHex}
                            className="w-full py-4 text-lg shrink-0"
                        >
                            {currentPlayer?.host ? "Begin the Hunt →" : "Awaiting Host..."}
                        </PrimaryButton>

                        <p className="text-center text-xs tracking-[0.3em] uppercase shrink-0"
                           style={{ color: "rgba(200,200,200,0.4)", fontStyle: "italic" }}>
                            ⚔ the hunt begins ⚔
                        </p>
                    </div>
                </Card>

            </motion.div>
            <Sidebar distribution={distribution} playerCount={players.length} isHost={!!currentPlayer?.host} openSettingsTrigger={OpenSettingsTrigger} />
        </motion.div>

    );
}