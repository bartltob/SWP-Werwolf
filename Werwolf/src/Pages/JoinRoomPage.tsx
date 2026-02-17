import { useState } from "react";
import { motion } from "framer-motion";
import { DoorOpen, ArrowRight } from "lucide-react";
import { ref, get } from "firebase/database";
import { db } from "../firebase-config.ts";
import { useNavigate } from "react-router-dom";

export default function JoinRoomPage() {
    const [roomCode, setRoomCode] = useState("");
    const [errors, setErrors] = useState({roomCode: "" });

    const navigate = useNavigate();

    const handleJoin = () => {
        let validRoom = true;
        const newErrors = {roomCode: "" };

        if (!/^[0-9]{6}$/.test(roomCode)) {
            newErrors.roomCode = "Room code must be exactly 6 digits.";
            validRoom = false;
        }

        setErrors(newErrors);

        if (validRoom) {
            const docRef = ref(db, 'rooms/' + roomCode);
            get(docRef)
                .then((snapshot: { exists: () => any }) => {
                    if (snapshot.exists()) {
                        localStorage.setItem('roomKey', roomCode);
                        navigate('/GamePage');
                    } else {
                        setErrors(prev => ({ ...prev, roomCode: "Room not found. Please check the code." }));
                    }
                })
                .catch((error: any) => {
                    console.error("Error fetching room data:", error);
                    setErrors(prev => ({ ...prev, roomCode: "An error occurred. Please try again." }));
                });
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-black flex items-center justify-center p-6 text-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md bg-zinc-900/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-zinc-700 p-8 space-y-6"
            >
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-zinc-800 rounded-2xl">
                        <DoorOpen size={26} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Join a Room</h1>
                        <p className="text-sm text-zinc-400">Enter the room code to join the game</p>
                    </div>
                </div>

                {/* Form */}
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm text-zinc-400">Room Code</label>
                        <input
                            type="text"
                            placeholder="000000"
                            value={roomCode}
                            maxLength={6}
                            onChange={(e) => {
                                const numericValue = e.target.value.replace(/\D/g, '');
                                if (numericValue.length <= 6) setRoomCode(numericValue);
                            }}
                            className={`w-full bg-zinc-800 border rounded-xl px-4 py-3 outline-none focus:border-zinc-500 transition tracking-widest text-center font-semibold ${errors.roomCode ? 'border-red-500' : 'border-zinc-700'}`}
                        />
                        {errors.roomCode && <p className="text-xs text-red-500 mt-1">{errors.roomCode}</p>}
                    </div>
                </div>

                {/* Join Button */}
                <button
                    onClick={handleJoin}
                    className="w-full py-4 rounded-2xl text-lg font-semibold bg-gradient-to-r from-red-700 via-red-600 to-red-700 hover:scale-[1.02] transition transform shadow-lg flex items-center justify-center gap-2"
                >
                    Join Game
                    <ArrowRight size={18} />
                </button>
            </motion.div>
        </div>
    );
}