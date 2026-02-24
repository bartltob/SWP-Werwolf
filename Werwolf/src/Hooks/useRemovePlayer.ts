import { ref, remove, get, update } from 'firebase/database';
import { db } from '../firebase-config';

export const useRemovePlayer = () => {
    const removePlayer = async () => {
        const roomKey = sessionStorage.getItem('roomKey');
        const PlayerId = sessionStorage.getItem('playerId');

        if (!roomKey || !PlayerId) return;

        try {
            const playerRef = ref(db, `rooms/${roomKey}/players/${PlayerId}`);
            const snapshot = await get(playerRef);
            const playerData = snapshot.val();

            if (playerData?.host === true) {
                const playersRef = ref(db, `rooms/${roomKey}/players`);
                const playersSnap = await get(playersRef);
                const allPlayers = playersSnap.val() as Record<string, { host?: boolean }> | null;

                const otherIds = allPlayers
                    ? Object.keys(allPlayers).filter(id => id !== PlayerId)
                    : [];

                if (otherIds.length === 0) {
                    await remove(ref(db, `rooms/${roomKey}`));
                    return;
                }

                const newHostId = otherIds[Math.floor(Math.random() * otherIds.length)];
                await update(ref(db, `rooms/${roomKey}/players/${newHostId}`), { host: true });
            }

            await remove(playerRef);
        } catch (err) {
            console.error('useRemovePlayer - Error:', err);
        } finally {
            sessionStorage.removeItem('roomKey');
            sessionStorage.removeItem('playerId');
        }
    };

    return { removePlayer };
};
