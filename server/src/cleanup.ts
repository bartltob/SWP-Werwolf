import * as admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";
import * as fs from "fs";
import * as path from "path";

const serviceAccount: ServiceAccount = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "../serviceAccountKey.json"), "utf-8")
);

// ─── Firebase Admin initialisieren ───────────────────────────────────────────
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL:
        "https://werwolf-11fc1-default-rtdb.europe-west1.firebasedatabase.app",
});

const db = admin.database();

// ─── Konstanten ───────────────────────────────────────────────────────────────
const GRACE_PERIOD_MS = 10_000; // 10 Sekunden
const CHECK_INTERVAL_MS = 5_000; // alle 5 Sekunden prüfen
const ROOM_MAX_AGE_MS = 12 * 60 * 60 * 1000; // 12 Stunden

// ─── Typen ────────────────────────────────────────────────────────────────────
interface Player {
    nickname?: string;
    status?: string;
    lastSeen?: number;
    host?: boolean;
}

interface Room {
    players?: Record<string, Player>;
    created_at?: string;
}

// ─── Cleanup-Logik ────────────────────────────────────────────────────────────
async function runCleanup(): Promise<void> {
    const roomsRef = db.ref("rooms");

    let snapshot: admin.database.DataSnapshot;
    try {
        snapshot = await roomsRef.once("value");
    } catch (err) {
        console.error("[Cleanup] Fehler beim Lesen der Datenbank:", err);
        return;
    }

    const rooms = snapshot.val() as Record<string, Room> | null;
    if (!rooms) return;

    const now = Date.now();
    const updates: Record<string, null> = {};

    for (const [roomKey, room] of Object.entries(rooms)) {
        // ─── Raum-Alter prüfen (12h) ───────────────────────────────
        if (room.created_at) {
            const createdAtMs = new Date(room.created_at).getTime();

            if (!isNaN(createdAtMs)) {
                const age = now - createdAtMs;

                if (age > ROOM_MAX_AGE_MS) {
                    updates[`rooms/${roomKey}`] = null;
                    console.log(
                        `[Cleanup] Raum gelöscht (älter als 12h): ${roomKey}`
                    );
                    continue;
                }
            }
        }

        const players = room.players;

        // Kein players-Objekt → Raum direkt löschen
        if (!players || Object.keys(players).length === 0) {
            updates[`rooms/${roomKey}`] = null;
            console.log(`[Cleanup] Leerer Raum entfernt: ${roomKey}`);
            continue;
        }

        // Spieler prüfen
        for (const [playerId, player] of Object.entries(players)) {
            if (player.status === "disconnected" && player.lastSeen != null) {
                const elapsed = now - player.lastSeen;

                if (elapsed > GRACE_PERIOD_MS) {
                    updates[`rooms/${roomKey}/players/${playerId}`] = null;
                    console.log(
                        `[Cleanup] Spieler entfernt: ${player.nickname ?? playerId} ` +
                        `(Raum: ${roomKey}, offline seit ${Math.round(elapsed / 1000)}s)`
                    );
                }
            }
        }

        // Prüfen ob nach Player-Deletes noch Spieler übrig sind
        const remainingPlayers =
            Object.keys(players).length -
            Object.keys(updates).filter((k) =>
                k.startsWith(`rooms/${roomKey}/players/`)
            ).length;

        if (remainingPlayers === 0) {
            // einzelne Player-Deletes entfernen
            for (const key of Object.keys(updates)) {
                if (key.startsWith(`rooms/${roomKey}/players/`)) {
                    delete updates[key];
                }
            }

            updates[`rooms/${roomKey}`] = null;
            console.log(
                `[Cleanup] Raum gelöscht (alle Spieler entfernt): ${roomKey}`
            );
        }
    }

    if (Object.keys(updates).length > 0) {
        try {
            await db.ref().update(updates);
        } catch (err) {
            console.error("[Cleanup] Fehler beim Schreiben der Updates:", err);
        }
    }
}

// ─── Start ────────────────────────────────────────────────────────────────────
console.log(
    `[Server] Cleanup-Server gestartet. Prüfintervall: ${CHECK_INTERVAL_MS / 1000}s, ` +
    `Grace-Period: ${GRACE_PERIOD_MS / 1000}s, Max-Raum-Alter: 12h`
);

// Sofort einmal ausführen, dann im Interval
runCleanup();
setInterval(runCleanup, CHECK_INTERVAL_MS);
