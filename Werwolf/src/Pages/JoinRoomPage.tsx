import { useState } from "react";
import { motion } from "framer-motion";
import { ref, get } from "firebase/database";
import { db } from "../firebase-config";
import SetNickname from "../Components/SetNickname";
import Background from "../Components/Frontend/Background";

import { Card, Divider } from "../Components/Frontend/Decorations";
import HeaderBlock from "../Components/Frontend/HeaderBlock";
import TextInput from "../Components/Frontend/TextInput";
import PrimaryButton from "../Components/Frontend/PrimaryButton";
import { CornerOrnaments } from "../Components/Frontend/Decorations";

const accentHex = "#9b59f5";
const glowRgba = "rgba(155,89,245,0.6)";
const glowSoft = "rgba(155,89,245,0.2)";

export default function JoinRoomPage() {
    const [roomCode, setRoomCode] = useState("");
    const [errors, setErrors] = useState({ roomCode: "" });
    const [showNickname, setShowNickname] = useState(false);
    const [focused, setFocused] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleJoin = () => {
        let validRoom = true;
        const newErrors = { roomCode: "" };

        if (!/^[0-9]{6}$/.test(roomCode)) {
            newErrors.roomCode = "Room code must be exactly 6 digits.";
            validRoom = false;
        }

        setErrors(newErrors);

        if (validRoom) {
            setLoading(true);
            const docRef = ref(db, "rooms/" + roomCode);
            get(docRef)
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        localStorage.setItem("roomKey", roomCode);
                        setShowNickname(true);
                    } else {
                        setErrors((prev) => ({ ...prev, roomCode: "Room not found. Please check the code." }));
                    }
                })
                .catch((error) => {
                    console.error("Error fetching room data:", error);
                    setErrors((prev) => ({ ...prev, roomCode: "An error occurred. Please try again." }));
                })
                .finally(() => setLoading(false));
        }
    };

    if (showNickname) return <SetNickname newRoom={false} />;

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

                    {/* Subtle top glow */}
                    <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accentHex}66, transparent)` }} />

                    {/* Header */}
                    <HeaderBlock icon={"🌙"} title={"Join Room"} subtitle={"Enter the 6-digit code"} titleGradient={"linear-gradient(180deg, #e8d8ff 0%, #b57bf5 40%, #6a2fbf 100%)"} accentHex={accentHex} />

                    {/* Divider */}
                    <Divider accentHex={accentHex} />

                    {/* Input */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs tracking-[0.3em] uppercase" style={{ color: "rgba(180,140,80,0.5)" }}>
                            Room Code
                        </label>
                        <TextInput
                            value={roomCode}
                            onChange={(e) => {
                                const numericValue = e.target.value.replace(/\D/g, "");
                                if (numericValue.length <= 6) setRoomCode(numericValue);
                                setErrors({ roomCode: "" });
                            }}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                            placeholder={"000000"}
                            maxLength={6}
                            focused={focused}
                            accentHex={accentHex}
                            glowSoft={glowSoft}
                        />
                        {errors.roomCode && (
                            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs tracking-wide mt-1" style={{ color: "#e85d20", fontFamily: "Georgia, serif" }}>
                                <span className="inline-block w-1 h-1 rounded-full bg-current mr-2" />{errors.roomCode}
                            </motion.p>
                        )}
                    </div>

                    {/* Submit */}
                    <PrimaryButton onClick={handleJoin} disabled={loading || roomCode.length !== 6} accentHex={accentHex} glowRgba={glowRgba}>
                        {loading ? "Searching the Night..." : "Enter the Hunt →"}
                    </PrimaryButton>

                    {/* Footer */}
                    <p className="text-center text-xs tracking-[0.3em] uppercase" style={{ color: "rgba(100,70,40,0.4)", fontFamily: "Georgia, serif", fontStyle: "italic" }}>
                        ⚔ the night awaits ⚔
                    </p>
                </Card>
            </motion.div>
        </div>
    );
}