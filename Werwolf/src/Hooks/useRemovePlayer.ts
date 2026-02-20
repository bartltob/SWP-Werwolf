import { ref, remove } from 'firebase/database';
import { db } from '../firebase-config';

export const useRemovePlayer = () => {
    const removePlayer = async () => {
        const roomKey = sessionStorage.getItem('roomKey');
        const PlayerId = sessionStorage.getItem('playerId');
        if (!roomKey || !PlayerId) return;

        try {
            const playerRef = ref(db, `rooms/${roomKey}/players/${PlayerId}`);
            await remove(playerRef);
        } catch (err) {
            console.error('Error removing player:', err);
        } finally {
            sessionStorage.removeItem('roomKey');
            sessionStorage.removeItem('playerId');
        }
    };

    return { removePlayer };
};
