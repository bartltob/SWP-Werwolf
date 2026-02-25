import { useState, useEffect } from "react";
import {ref, push, set, get} from "firebase/database";
import { db } from "../firebase-config";
import { useCreateRoom } from "../Hooks/useCreateRoom";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Background from "./Frontend/Background";
import { Card, Divider, CornerOrnaments, CharCount } from "./Frontend/Decorations";
import HeaderBlock from "./Frontend/HeaderBlock";
import TextInput from "./Frontend/TextInput";
import PrimaryButton from "./Frontend/PrimaryButton";

type Props = {
    newRoom: boolean;
};

async function isNicknameAvailable(roomKey: string | null, nickname: string): Promise<boolean> {
    const playersSnap = await get(ref(db, `rooms/${roomKey}/players`));

    let taken = false;
    playersSnap.forEach((child) => {
        const p = child.val();
        if (typeof p?.nickname === "string" && p.nickname.trim().toLowerCase() === nickname.trim().toLowerCase()) {
            taken = true;
            return true;
        }
        return false;
    });

    return !taken;
}

export default function SetNickname({ newRoom }: Props) {
    const [nickname, setNickname] = useState("");
    const [loading, setLoading] = useState(false);
    const [focused, setFocused] = useState(false);
    const [nicknameError, setNicknameError] = useState("");
    const { createRoom } = useCreateRoom();
    const navigate = useNavigate();

    useEffect(() => {
        const existingPlayerId = sessionStorage.getItem("playerId");
        if (existingPlayerId) {
            navigate("/GamePage");
        }
    }, [navigate]);

    const handleSubmit = async () => {
        if (nickname.trim() === "") return;

        try {
            setLoading(true);
            setNicknameError("");

            if (newRoom) await createRoom();
            const roomKey = sessionStorage.getItem("roomKey");

            if (!roomKey) {
                console.error("Missing roomKey after create/join");
                navigate("/");
                return;
            }

            const available = await isNicknameAvailable(roomKey, nickname);
            if (!available) {
                setNicknameError("This name is already taken. Choose another.");
                setLoading(false);
                return;
            }

            const playersRef = ref(db, `rooms/${roomKey}/players`);
            const newPlayerRef = push(playersRef);

            await set(newPlayerRef, {
                id: newPlayerRef.key,
                nickname: nickname.trim(),
                host: newRoom,
                status: "online",
            });

            sessionStorage.setItem("playerId", String(newPlayerRef.key));
            navigate("/GamePage");
        } catch (err) {
            console.error("Error saving nickname:", err);
        } finally {
            setLoading(false);
        }
    };

    const isRed = newRoom;
    const accentHex = isRed ? "#e85d20" : "#9b59f5";
    const glowRgba = isRed ? "rgba(232,93,32,0.6)" : "rgba(155,89,245,0.6)";
    const glowSoft = isRed ? "rgba(232,93,32,0.2)" : "rgba(155,89,245,0.2)";
    const titleGradient = isRed
        ? "linear-gradient(180deg, #fff8dc 0%, #f5c842 40%, #c8701a 100%)"
        : "linear-gradient(180deg, #e8d8ff 0%, #b57bf5 40%, #6a2fbf 100%)";

    return (
        <div className="relative w-full min-h-screen text-white flex items-center justify-center px-6 overflow-hidden"
             style={{ background: "#060410", fontFamily: "'Cinzel', Georgia, serif" }}>

            <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cinzel+Decorative:wght@700&display=swap');`}</style>

            <Background />

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-w-md"
            >
                <Card accentHex={accentHex} glowRgba={glowRgba}>
                    <CornerOrnaments accentHex={accentHex} />

                    <div className="absolute top-0 left-0 right-0 h-px"
                         style={{ background: `linear-gradient(90deg, transparent, ${accentHex}66, transparent)` }} />

                    <HeaderBlock
                        icon={newRoom ? "🔥" : "🌙"}
                        title={newRoom ? "Create Room" : "Join Room"}
                        subtitle="Choose your name"
                        titleGradient={titleGradient}
                        accentHex={accentHex}
                    />

                    <Divider accentHex={accentHex} />

                    {/* Input */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs tracking-[0.1em] uppercase"
                               style={{ color: "rgba(180,140,80,0.5)" }}>
                            Nickname
                        </label>
                        <div className="relative text-sm">
                            <TextInput
                                value={nickname}
                                onChange={(e) => {
                                    setNickname(e.target.value);
                                    if (nicknameError) setNicknameError("");
                                }}
                                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                                onFocus={() => setFocused(true)}
                                onBlur={() => setFocused(false)}
                                placeholder="Enter your name..."
                                maxLength={20}
                                focused={focused}
                                accentHex={nicknameError ? "#e85d20" : accentHex}
                                glowSoft={nicknameError ? "rgba(232,93,32,0.2)" : glowSoft}
                            />
                            <CharCount count={nickname.length} />
                        </div>

                        {/* Inline styled error — replaces the browser alert() */}
                        <AnimatePresence>
                            {nicknameError && (
                                <motion.div
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    transition={{ duration: 0.25 }}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg"
                                    style={{
                                        background: "rgba(232,93,32,0.08)",
                                        border: "1px solid rgba(232,93,32,0.3)",
                                    }}
                                >
                                    <span style={{ color: "#e85d20", fontSize: "0.75rem" }}>⚔</span>
                                    <p className="text-xs tracking-wide"
                                       style={{ color: "#e85d20", fontFamily: "Georgia, serif" }}>
                                        {nicknameError}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <PrimaryButton
                        onClick={handleSubmit}
                        disabled={loading || nickname.trim() === ""}
                        accentHex={accentHex}
                        glowRgba={glowRgba}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-3">
                                <motion.span
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="inline-block w-4 h-4 rounded-full border-2 border-transparent"
                                    style={{ borderTopColor: accentHex }}
                                />
                                Entering the Night...
                            </span>
                        ) : (
                            "Enter the Night →"
                        )}
                    </PrimaryButton>

                    <p className="text-center text-xs tracking-[0.3em] uppercase"
                       style={{ color: "rgba(100,70,40,0.4)", fontFamily: "Georgia, serif", fontStyle: "italic" }}>
                        ⚔ the night awaits ⚔
                    </p>
                </Card>
            </motion.div>
        </div>
    );
}