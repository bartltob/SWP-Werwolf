
import { usePresenceHandler } from "../Hooks/usePresenceHandler";
import {useRoomGuard} from "../Hooks/useRoomGuard.tsx";
import GameFlow, {type GamePhase} from "../Components/GameFlow.tsx";

export default function GamePage() {
    const { roomKey, playerId, loading } = useRoomGuard()

    usePresenceHandler(roomKey || "", playerId || "")
    const phase: GamePhase = "lobby";
    if (loading) return <div>Loading...</div>

    return <GameFlow phase={phase} />

}
