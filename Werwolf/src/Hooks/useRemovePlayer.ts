import { ref, remove, get, update, onDisconnect } from 'firebase/database';
import { db } from '../firebase-config';

type props = {
    roomKey: string;
    playerId: string;
    isSelf?: boolean; // true = Spieler verlässt selbst (Leave), false = Host kickt jemanden
}

export const useRemovePlayer = ({ roomKey, playerId, isSelf = true }: props) => {
    const removePlayer = async () => {

        if (!roomKey || !playerId) return;

        try {
            const playerRef = ref(db, `rooms/${roomKey}/players/${playerId}`);

            // onDisconnect-Handler canceln damit kein Ghost-Write nach dem remove() feuert
            await onDisconnect(playerRef).cancel().catch(() => {});

            const snapshot = await get(playerRef);
            const playerData = snapshot.val();

            if (playerData?.host === true) {
                const playersRef = ref(db, `rooms/${roomKey}/players`);
                const playersSnap = await get(playersRef);
                const allPlayers = playersSnap.val() as Record<string, { host?: boolean }> | null;

                const otherIds = allPlayers
                    ? Object.keys(allPlayers).filter(id => id !== playerId)
                    : [];

                if (otherIds.length === 0) {
                    await remove(ref(db, `rooms/${roomKey}`));
                    if (isSelf) {
                        sessionStorage.removeItem('roomKey');
                        sessionStorage.removeItem('playerId');
                    }
                    return;
                }

                const newHostId = otherIds[Math.floor(Math.random() * otherIds.length)];
                await update(ref(db, `rooms/${roomKey}/players/${newHostId}`), { host: true });
            }

            await remove(playerRef);
        } catch (err) {
            console.error('useRemovePlayer - Error:', err);
        } finally {
            // sessionStorage nur löschen wenn Spieler sich selbst entfernt (Leave)
            // Beim Kick eines anderen Spielers darf die eigene Session nicht angefasst werden
            if (isSelf) {
                sessionStorage.removeItem('roomKey');
                sessionStorage.removeItem('playerId');
            }
        }
    };

    return { removePlayer };
};
