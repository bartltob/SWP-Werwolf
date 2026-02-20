import { ref, remove } from 'firebase/database';
import { db } from '../firebase-config';

export const useRemovePlayer = () => {
    const removePlayer = async () => {
        const roomKey = localStorage.getItem('roomKey');
        const PlayerId = localStorage.getItem('playerId');
        if (!roomKey || !PlayerId) return;

        try {
            const playerRef = ref(db, `rooms/${roomKey}/players/${PlayerId}`);
            // Completely remove player from database when leaving explicitly
            await remove(playerRef);

            localStorage.removeItem('roomKey');
            localStorage.removeItem('playerId');
        } catch (err) {
            console.error('Error removing player:', err);
            // Clear localStorage even if removal fails
            localStorage.removeItem('roomKey');
            localStorage.removeItem('playerId');
        }
    };

    return { removePlayer };
};

