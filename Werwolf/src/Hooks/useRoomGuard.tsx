// Hooks/useRoomGuard.ts
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ref, get } from "firebase/database"
import { db } from "../firebase-config"

export function useRoomGuard() {
    const navigate = useNavigate()

    const [roomKey, setRoomKey] = useState<string | null>(null)
    const [playerId, setPlayerId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function validateAccess() {
            const storedRoomKey = sessionStorage.getItem("roomKey")
            const storedPlayerId = sessionStorage.getItem("playerId")

            if (!storedRoomKey || !storedPlayerId) {
                navigate("/")
                return
            }

            try {
                const playerRef = ref(
                    db,
                    `rooms/${storedRoomKey}/players/${storedPlayerId}`
                )

                const snapshot = await get(playerRef)

                if (!snapshot.exists() || !snapshot.val()?.nickname) {
                    sessionStorage.clear()
                    navigate("/")
                    return
                }

                setRoomKey(storedRoomKey)
                setPlayerId(storedPlayerId)
            } catch (error) {
                console.error("Room validation failed:", error)
                sessionStorage.clear()
                navigate("/")
            }

            setLoading(false)
        }

        validateAccess()
    }, [navigate])

    return { roomKey, playerId, loading }
}