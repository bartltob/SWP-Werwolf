import { useState, useEffect } from "react";
import WaitingRoom from "../Components/WaitingRoom";
import { ref, onDisconnect, get, child } from "firebase/database";
import { db } from "../firebase-config";
import { useNavigate } from "react-router-dom";

export default function GamePage() {
    const [isWaiting] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const roomKey = localStorage.getItem("roomKey");
        const playerId = localStorage.getItem("playerId");

        if (!roomKey || !playerId) {
            navigate("/");
            return;
        }

        const playerRef = ref(db, `rooms/${roomKey}/players/${playerId}`);

        onDisconnect(playerRef).remove().catch((err) => {
            console.error("Failed to setup onDisconnect:", err);
        });

        const roomRef = ref(db, `rooms/${roomKey}/players`);
        get(child(roomRef, playerId))
            .then((snapshot) => {
                if (!snapshot.exists()) {
                    localStorage.removeItem("roomKey");
                    localStorage.removeItem("playerId");
                    navigate("/");
                }
            })
            .catch((err) => {
                console.error("Error checking player existence:", err);
                localStorage.removeItem("roomKey");
                localStorage.removeItem("playerId");
                navigate("/");
            });

    }, [navigate]);

    if (isWaiting) return <WaitingRoom />;

    return <div></div>;
}
