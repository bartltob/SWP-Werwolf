import { useState, useEffect } from "react";
import WaitingRoom from "../Components/WaitingRoom";
import { ref, onDisconnect } from "firebase/database";
import { db } from "../firebase-config";

export default function GamePage() {
    const [isWaiting] = useState(true);

    useEffect(() => {
        const roomKey = localStorage.getItem("roomKey");
        const playerId = localStorage.getItem("playerId");

        if (!roomKey || !playerId) return;

        const playerRef = ref(db, `rooms/${roomKey}/players/${playerId}`);

        onDisconnect(playerRef).remove().catch((err) => {
            console.error("Failed to setup onDisconnect:", err);
        });

    }, []);

    if (isWaiting) return <WaitingRoom />;

    return <div></div>;
}
