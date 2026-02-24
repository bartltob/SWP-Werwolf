import WaitingRoom from "./WaitingRoom.tsx";

export type GamePhase = "lobby" | "night" | "day" | "result";

export default function GameFlow({ phase }: { phase: GamePhase }) {
    switch (phase) {
        case "lobby":
            return <WaitingRoom />

        case "night":
            return <div>night</div>

        case "day":
            return <div>day</div>

        case "result":
            return <div>result</div>

        default:
            return <div>Unknown game phase</div>
    }
}