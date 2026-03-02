import * as admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";
import * as fs from "fs";
import * as path from "path";

const serviceAccount: ServiceAccount = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "../serviceAccountKey.json"), "utf-8")
);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://werwolf-11fc1-default-rtdb.europe-west1.firebasedatabase.app",
});

const db = admin.database();

const DISCONNECT_GRACE_MS = 5_000;   // 5s nach "disconnected" → entfernen
const HEARTBEAT_TIMEOUT_MS = 10_000; // 10s kein Heartbeat → entfernen (Zombie-Fallback)
const CHECK_INTERVAL_MS = 5_000;
const ROOM_MAX_AGE_MS = 12 * 60 * 60 * 1000;

interface Player {
    nickname?: string;
    status?: string;
    lastSeen?: number;
    heartbeat?: number;
    host?: boolean;
}

interface Room {
    players?: Record<string, Player>;
    created_at?: string;
}

async function getFirebaseServerTime(): Promise<number> {
    const snap = await db.ref(".info/serverTimeOffset").once("value");
    return Date.now() + (snap.val() ?? 0);
}

async function runCleanup(): Promise<void> {
    let snapshot: admin.database.DataSnapshot;
    try {
        snapshot = await db.ref("rooms").once("value");
    } catch (err) {
        console.error("[Cleanup] Fehler beim Lesen der Datenbank:", err);
        return;
    }

    const rooms = snapshot.val() as Record<string, Room> | null;
    if (!rooms) return;

    const now = await getFirebaseServerTime();
    const updates: Record<string, null | boolean> = {};

    for (const [roomKey, room] of Object.entries(rooms)) {
        // Raum älter als 12h → löschen
        if (room.created_at) {
            const createdAtMs = new Date(room.created_at).getTime();
            if (!isNaN(createdAtMs) && now - createdAtMs > ROOM_MAX_AGE_MS) {
                updates[`rooms/${roomKey}`] = null;
                console.log(`[Cleanup] Raum gelöscht (älter als 12h): ${roomKey}`);
                continue;
            }
        }

        const players = room.players;

        if (!players || Object.keys(players).length === 0) {
            updates[`rooms/${roomKey}`] = null;
            console.log(`[Cleanup] Leerer Raum entfernt: ${roomKey}`);
            continue;
        }

        const playersToRemove: string[] = [];

        for (const [playerId, player] of Object.entries(players)) {
            // Spieler ist als disconnected markiert und lastSeen ist älter als 5s
            const isDisconnected =
                player.status === "disconnected" &&
                player.lastSeen != null &&
                now - player.lastSeen > DISCONNECT_GRACE_MS;

            // Fallback: Heartbeat älter als 10s (z.B. Tab gecrasht ohne onDisconnect)
            const isZombie =
                player.heartbeat != null &&
                now - player.heartbeat > HEARTBEAT_TIMEOUT_MS;

            if (isDisconnected || isZombie) {
                playersToRemove.push(playerId);
                console.log(
                    `[Cleanup] Spieler markiert zum Entfernen: ${player.nickname ?? playerId}` +
                    ` (Raum: ${roomKey}, Grund: ${isDisconnected ? `disconnected seit ${Math.round((now - (player.lastSeen ?? 0)) / 1000)}s` : `kein Heartbeat seit ${Math.round((now - (player.heartbeat ?? 0)) / 1000)}s`})`
                );
            }
        }

        for (const playerId of playersToRemove) {
            const player = players[playerId];

            // Host-Übergabe falls nötig
            if (player.host === true) {
                const candidates = Object.entries(players).filter(
                    ([id, p]) => id !== playerId && !playersToRemove.includes(id) && p.status !== "disconnected"
                );
                if (candidates.length > 0) {
                    const [newHostId] = candidates[Math.floor(Math.random() * candidates.length)];
                    updates[`rooms/${roomKey}/players/${newHostId}/host`] = true;
                    console.log(
                        `[Cleanup] Host-Übergabe: ${player.nickname ?? playerId} → ${players[newHostId]?.nickname ?? newHostId} (Raum: ${roomKey})`
                    );
                }
            }

            updates[`rooms/${roomKey}/players/${playerId}`] = null;
        }

        // Raum löschen wenn danach leer
        const remainingCount = Object.keys(players).length - playersToRemove.length;
        if (remainingCount === 0) {
            for (const key of Object.keys(updates)) {
                if (key.startsWith(`rooms/${roomKey}/`)) delete updates[key];
            }
            updates[`rooms/${roomKey}`] = null;
            console.log(`[Cleanup] Raum gelöscht (keine Spieler mehr): ${roomKey}`);
        }
    }

    if (Object.keys(updates).length > 0) {
        try {
            await db.ref().update(updates as Record<string, any>);
        } catch (err) {
            console.error("[Cleanup] Fehler beim Schreiben der Updates:", err);
        }
    }
}

console.log(`[Server] Cleanup gestartet – Interval: ${CHECK_INTERVAL_MS / 1000}s, Disconnect-Grace: ${DISCONNECT_GRACE_MS / 1000}s, Heartbeat-Timeout: ${HEARTBEAT_TIMEOUT_MS / 1000}s`);

runCleanup();
setInterval(runCleanup, CHECK_INTERVAL_MS);
