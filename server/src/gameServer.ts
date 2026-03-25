import express from "express";
import http from "http";
import { Server } from "socket.io";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

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
                Authorization: `Bearer ${directusToken}` // only if auth needed
            }
        });

        const data = await res.json();
        console.log("Raw response from Directus:", data); // 🔥 check this

        cards = data.data;
        console.log("Cards loaded:", cards.length);
    } catch (err) {
        console.error("Error loading cards:", err);
    }
}

// Load once at server start
loadCards();

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinRoom", ({ roomId, name,playerId }) => {
        socket.join(roomId);

        if (!rooms[roomId]) rooms[roomId] = [];

        // check ob schon drin
        const alreadyExists = rooms[roomId].some((p: { id: string; }) => p.id === socket.id);

        if (!alreadyExists) {
            rooms[roomId].push({
                sockerId: socket.id,
                playerId,
                name,
                role: null
            });
        }

        io.to(roomId).emit("playersUpdate", rooms[roomId]);
    });

    socket.on("startGame", (roomId) => {
        const players = rooms[roomId];

        if (!players) return;

        // Rollen verteilen
        const roles = ["Werwolf", ...Array(players.length - 1).fill("Dorfbewohner")];
        roles.sort(() => Math.random() - 0.5);

        players.forEach((p: any, i: number) => {
            p.role = roles[i];

            // NUR eigene Rolle senden
            io.to(p.id).emit("yourRole", p.role);
        });

        for(const p of players) {
            console.log(`Spieler ${p.name} (${p.playerId}) bekommt Rolle: ${p.role}`);
        }
        io.to(roomId).emit("gameStarted");
    });
});

server.listen(3001, () => {
    console.log("Game Server läuft auf 3001");
});