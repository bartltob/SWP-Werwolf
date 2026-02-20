import { ref, onDisconnect, update, serverTimestamp } from "firebase/database";
import { db } from "../firebase-config";
import { useEffect } from "react";

export const usePresenceHandler = (roomKey: string, playerId: string) => {
    useEffect(() => {
        if (!roomKey || !playerId) return;

        const playerRef = ref(db, `rooms/${roomKey}/players/${playerId}`);

        update(playerRef, {
            status: "online",
            lastOnline: serverTimestamp(),
        }).catch((err) => {
            console.error("Failed to set initial online status:", err);
        });

        // Bei Verbindungsabbruch Status auf "disconnected" setzen – kein Remove
        onDisconnect(playerRef)
            .update({
                status: "disconnected",
                lastSeen: serverTimestamp(),
            })
            .catch((err) => {
                console.error("Failed to setup onDisconnect:", err);
            });

    }, [roomKey, playerId]);
};
