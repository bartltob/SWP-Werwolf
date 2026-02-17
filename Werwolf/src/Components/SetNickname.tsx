import { useState } from "react";

interface Props {
    onSubmit: (nickname: string) => void;
}

export default function SetNickname({onSubmit}: Props) {
    const [nickname, setNickname] = useState("");

    const handleSubmit = () => {
        if (nickname.trim() === "") return;
        onSubmit(nickname.trim());
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white px-6">

            <div className="w-full max-w-md bg-gray-800/60 backdrop-blur-md p-10 rounded-2xl shadow-2xl border border-gray-700">

                {/* Titel */}
                <h1 className="text-3xl font-bold text-center mb-2">
                    🐺 Willkommen
                </h1>
                <p className="text-gray-400 text-center mb-8">
                    Wähle deinen Namen für das Spiel
                </p>

                {/* Input */}
                <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Dein Nickname..."
                    className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-500 outline-none transition-all duration-300 text-white placeholder-gray-500"
                />

                {/* Button */}
                <button
                   onClick={handleSubmit} className="mt-6 w-full bg-red-600 hover:bg-red-700 transition-all duration-300 py-3 rounded-xl font-semibold shadow-lg hover:shadow-red-600/40"
                >
                    Weiter
                </button>

            </div>

        </div>
    );
}
