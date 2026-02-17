import { useState } from "react";
import { ref, push, set } from "firebase/database";
import { db } from "../firebase-config";
import {useCreateRoom} from "../Hooks/useCreateRoom.ts";

export default function SetNickname (){
    const [nickname, setNickname] = useState("");
    const [loading, setLoading] = useState(false);
    const { createRoom } = useCreateRoom();

    const handleSubmit = async () => {
        if (nickname.trim() === "") return;

        try {
            setLoading(true);

            await createRoom();
            const roomKey = localStorage.getItem("roomKey");
            const playersRef = ref(db, `rooms/${roomKey}/players`);
            const newPlayerRef = push(playersRef);

            await set(newPlayerRef, {
                id: newPlayerRef.key,
                nickname: nickname.trim(),
                host: false,
            });

            localStorage.setItem("playerId", String(newPlayerRef.key));


        } catch (err) {
            console.error("Error saving nickname:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
            <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-700 w-full max-w-md">

                <h1 className="text-2xl font-bold mb-6 text-center">
                    🐺 Enter Your Nickname
                </h1>

                <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Nickname..."
                    className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-600 focus:border-red-500 outline-none"
                />

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="mt-6 w-full bg-red-600 hover:bg-red-700 py-3 rounded-xl font-semibold transition"
                >
                    {loading ? "Saving..." : "Continue"}
                </button>

            </div>
        </div>
    );
}
