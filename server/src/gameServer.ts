import express from "express";
import http from "http";
import { Server } from "socket.io";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });
console.log(process.env.DIRECTUS_URL)

const directusURL= process.env.DIRECTUS_URL;
const directusToken = process.env.DIRECTUS_AUTH_TOKEN;

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

let rooms: any = {};
let cards: any[] = [];

async function loadCards() {
    try {
        const res = await fetch(`${directusURL}/items/werewolf_collection`, {
            headers: {
                Authorization: `${directusToken}` // only if auth needed
            }
        });

        const data = await res.json();
        cards = data.data;
    } catch (err) {
        console.error("Error loading cards:", err);
    }
}

// Load once at server start
loadCards();

io.on("connection", (socket) => {

    socket.on("joinRoom", ({ roomId, name, playerId }) => {
        socket.join(roomId);

        if (!rooms[roomId]) rooms[roomId] = [];

        rooms[roomId].push({
            socketId: socket.id,
            playerId,
            name,
            role: null
        });

        console.log(rooms);
        const playerCount = rooms[roomId].length;
        const distribution = calculateCardDistribution(playerCount, cards);
        io.to(roomId).emit("playersUpdate", rooms[roomId]);
        io.to(roomId).emit("cardDistributionUpdate", distribution);
    });

    // ── NEU: Spieler verlässt Room explizit ──────────────────────────────────
    socket.on("leaveRoom", (roomId) => {
        handlePlayerLeave(socket, roomId);
    });

    // ── NEU: Verbindung getrennt (Tab schließen, Absturz, etc.) ─────────────
    socket.on("disconnect", () => {
        // Suche in allen Rooms nach diesem Socket
        for (const roomId of Object.keys(rooms)) {
            const index = rooms[roomId].findIndex(
                (p: any) => p.socketId === socket.id
            );
            if (index !== -1) {
                handlePlayerLeave(socket, roomId);
                break; // Ein Socket kann nur in einem Room sein (bei deinem Setup)
            }
        }
    });

    socket.on("startGame", (roomId) => {
        const players = rooms[roomId];
        if (!players) return;

        cards.sort(() => Math.random() - 0.5);

        players.forEach((p: any, i: number) => {
            p.role = cards[i].name;
            io.to(p.socketId).emit("yourRole", p.role); // ← Fix: p.id → p.socketId
        });

        for (const p of players) {
            console.log(`Spieler ${p.name} (${p.playerId}) bekommt Rolle: ${p.role}`);
        }
        io.to(roomId).emit("gameStarted");
    });
});

// ── Hilfsfunktion ────────────────────────────────────────────────────────────
function handlePlayerLeave(socket: any, roomId: string) {
    if (!rooms[roomId]) return;

    const leavingPlayer = rooms[roomId].find(
        (p: any) => p.socketId === socket.id
    );
    if (!leavingPlayer) return;

    // Spieler entfernen
    rooms[roomId] = rooms[roomId].filter(
        (p: any) => p.socketId !== socket.id
    );
    socket.leave(roomId);

    console.log(
        `[Room ${roomId}] ${leavingPlayer.name} hat den Raum verlassen. ` +
        `Verbleibend: ${rooms[roomId].length}`
    );

    // Room löschen wenn leer
    if (rooms[roomId].length === 0) {
        delete rooms[roomId];
        console.log(`[Room ${roomId}] Raum gelöscht (leer)`);
        return;
    }

    // Karten neu kalkulieren und broadcasten
    const newCount = rooms[roomId].length;
    const newDistribution = calculateCardDistribution(newCount, cards);

    io.to(roomId).emit("playersUpdate", rooms[roomId]);
    io.to(roomId).emit("cardDistributionUpdate", newDistribution);
}


function calculateCardDistribution(playerCount: number,cards:any) {
    const distribution: { [key: string]: number } = {
    };

    for(const card of cards) {
        distribution[card.name] = 0;
    }

    if (playerCount >= 5) distribution.Werewolf = 1;
    if (playerCount >= 7) distribution.Werewolf = 2;
    if (playerCount >= 10) distribution.Werewolf = 3;

    if (playerCount >= 6) distribution.Seer = 1;
    if (playerCount >= 8) distribution.Hunter = 1;
    if (playerCount >= 9) distribution.Witch = 1;
    if (playerCount >= 10) distribution.Cupid = 1;

    let sum = 0;

    for (const role in distribution) {
        sum += distribution[role];
    }
    console.log(sum)
    distribution.Villager = playerCount - sum;
    console.log(distribution);


    return distribution;
}


server.listen(3001, () => {
    console.log("Game Server läuft auf 3001");
});