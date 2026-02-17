import { useState, useEffect } from "react";
import { Users, Crown, Copy, LogOut, Moon, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SetNickname from "./SetNickname";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase-config";

export default function WaitingRoom() {

    const [nickname, setNickname] = useState<string | null>(null);
    const [roomKey, setRoomKey] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [players, setPlayers] = useState<any[]>([]);


    const navigate = useNavigate();

    useEffect(() => {
        if (!roomKey) return;

        const playersRef = ref(db, `rooms/${roomKey}/players`);

        const unsubscribe = onValue(playersRef, (snapshot) => {
            const data = snapshot.val();

            if (data) {
                const playersArray = Object.entries(data).map(
                    ([id, value]: any) => ({
                        id,
                        ...value,
                    })
                );

                setPlayers(playersArray);
                console.log("Updated players:", playersArray);
            } else {
                setPlayers([]);
            }
        });

        return () => unsubscribe();
    }, [roomKey]);


    useEffect(() => {
        const key = localStorage.getItem("roomKey");
        if (key) {
            setRoomKey(key);
        } else {
            navigate("/"); // Falls kein Room existiert → zurück
        }
    }, [navigate]);

    const handleCopy = async () => {
        if (!roomKey) return;
        await navigator.clipboard.writeText(roomKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!nickname && roomKey) {
        return (
            <SetNickname
                roomKey={roomKey}
                onSuccess={(nickname) => {
                    setNickname(nickname);
                }}
            />
        );
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-black text-white flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-4xl bg-zinc-900/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-zinc-700 p-8 grid md:grid-cols-3 gap-8"
            >
                {/* LEFT */}
                <div className="md:col-span-2 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-zinc-800 rounded-2xl">
                                <Moon size={28} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-wide">
                                    Werewolf Lobby
                                </h1>
                                <p className="text-zinc-400 text-sm">
                                    Willkommen, {nickname}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate("/")}
                            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 transition px-4 py-2 rounded-xl text-sm"
                        >
                            <LogOut size={16} />
                            Leave
                        </button>
                    </div>

                    {/* Player List */}
                    <div className="bg-zinc-800/60 rounded-2xl p-6 border border-zinc-700 flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-zinc-300">
                            <Users size={18} />
                            <span className="text-sm">
                                {players.length} players joined
                            </span>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            {players.map((player) => (
                                <motion.div
                                    key={player.id}
                                    whileHover={{ scale: 1.02 }}
                                    className="flex items-center justify-between bg-zinc-900 rounded-xl px-4 py-3 border border-zinc-700"
                                >
                                    <span className="font-medium">
                                        {player.nickname}
                                    </span>
                                    {player.host && (
                                        <span className="flex items-center gap-1 text-yellow-400 text-xs">
                                            <Crown size={14} /> Host
                                        </span>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col justify-between gap-6">
                    <div className="bg-zinc-800/60 rounded-2xl p-6 border border-zinc-700 flex flex-col gap-4">
                        <p className="text-sm text-zinc-400">Room Code</p>
                        <div className="flex items-center justify-between bg-zinc-900 rounded-xl px-4 py-3 border border-zinc-700">
                            <span className="tracking-widest font-semibold">
                                {roomKey}
                            </span>
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-2 hover:text-zinc-300 transition text-sm"
                            >
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                            </button>
                        </div>
                    </div>

                    <button className="w-full py-4 rounded-2xl text-lg font-semibold bg-gradient-to-r from-red-700 via-red-600 to-red-700 hover:scale-[1.02] transition transform shadow-lg">
                        Start Game
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
