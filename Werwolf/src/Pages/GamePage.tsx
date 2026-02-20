import { useState, useEffect } from "react";
import WaitingRoom from "../Components/WaitingRoom";
import { ref, get, child } from "firebase/database";
import { db } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { usePresenceHandler } from "../Hooks/usePresenceHandler";

export default function GamePage() {
    const [isWaiting] = useState(true);
    const navigate = useNavigate();
    const [roomKey, setRoomKey] = useState<string | null>(null);
    const [playerId, setPlayerId] = useState<string | null>(null);

    useEffect(() => {
        const storedRoomKey = localStorage.getItem("roomKey");
        const storedPlayerId = localStorage.getItem("playerId");

        if (!storedRoomKey || !storedPlayerId) {
            navigate("/");
            return;
        }

        setRoomKey(storedRoomKey);
        setPlayerId(storedPlayerId);

        const playerRef = ref(db, `rooms/${storedRoomKey}/players`);
        get(child(playerRef, storedPlayerId))
            .then((snapshot) => {
                if (!snapshot.exists() || !snapshot.val()?.nickname) {
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

    usePresenceHandler(roomKey || "", playerId || "");

    if (isWaiting) return <WaitingRoom />;

    return <div></div>;
}
