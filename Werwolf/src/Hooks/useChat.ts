import { db } from "../firebase-config";
import { ref, serverTimestamp, push, onValue, off } from "firebase/database";
import { useCallback, useState, useEffect } from "react";


export type ChatMessage = {
    id: string;
    message: string;
    sender: string;
    createdAt: object;
    role: string;
};

export function useChat(roomKey: string | null, playerId: string | null, chatType: "village" | "werewolves" = "village") {
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    useEffect(() => {
        if (!roomKey) return;

        //     Prüfen ob der Spieler berechtigt ist diesen Chat zu LESEN:
        //  - "village"    → alle Spieler dürfen lesen (tagsüber + Lobby)
        //  - "werewolves" → nur Spieler mit role === "werewolf" dürfen lesen
        //  -  Wenn keine Berechtigung: früh returnen (kein Listener registrieren)

        const chatRef = ref(db, `rooms/${roomKey}/chats/${chatType}`);

        const unsub = onValue(chatRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const parsed: ChatMessage[] = Object.entries(data).map(([id, val]: any) => ({
                    id,
                    ...val,
                }));
                setMessages(parsed);
            } else {
                setMessages([]);
            }
        });

        return () => off(chatRef, "value", unsub);
    }, [roomKey, chatType]);

    const sendMessage = useCallback((text: string, type: "village" | "werewolves") => {
        if (!roomKey || !playerId) {
            console.warn("[useChat] sendMessage aborted: missing roomKey or playerId", { roomKey, playerId });
            return;
        }
        if (!text.trim()) return;

        //  Prüfen ob der Spieler berechtigt ist in diesen Chat zu SCHREIBEN:
        //  - "village"    → alle Spieler dürfen schreiben (tagsüber + Lobby)
        //  - "werewolves" → nur Spieler mit role === "werewolf" dürfen schreiben,
        //                   und nur nachts (phase === "night")
        // Spieler-Rolle aus Firebase lesen: rooms/${roomKey}/players/${playerId}/role

        const chatRef = ref(db, `rooms/${roomKey}/chats/${type}`);
        push(chatRef, {
            message: text.trim(),
            sender: playerId,
            createdAt: serverTimestamp(),
            role: "villager",
        }).catch((err) => console.error("[useChat] push failed:", err));

    }, [roomKey, playerId]);

    return { messages, sendMessage };
}
