import { ref, onDisconnect, update, serverTimestamp } from "firebase/database";
import { db } from "../firebase-config";
import { useEffect } from "react";

const HEARTBEAT_INTERVAL_MS = 4_000;

export const usePresenceHandler = (roomKey: string, playerId: string) => {
    useEffect(() => {
        if (!roomKey || !playerId) return;

        const playerRef = ref(db, `rooms/${roomKey}/players/${playerId}`);

        update(playerRef, {
            status: "online",
            lastSeen: null,
            heartbeat: serverTimestamp(),
        }).catch((err) => {
            console.error("Failed to set initial online status:", err);
        });

        // Bei Verbindungsabbruch: status + lastSeen setzen, heartbeat bleibt auf letztem Wert stehen
        onDisconnect(playerRef)
            .update({
                status: "disconnected",
                lastSeen: serverTimestamp(),
                heartbeat: serverTimestamp(),
            })
            .catch((err) => {
                console.error("Failed to setup onDisconnect:", err);
            });

        const heartbeatInterval = setInterval(() => {
            update(playerRef, { heartbeat: serverTimestamp() }).catch(() => {});
        }, HEARTBEAT_INTERVAL_MS);

        return () => clearInterval(heartbeatInterval);
    }, [roomKey, playerId]);
};
