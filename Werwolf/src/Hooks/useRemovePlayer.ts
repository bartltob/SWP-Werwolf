import { ref, remove } from 'firebase/database';
import { db } from '../firebase-config';

export const useRemovePlayer = () => {
    const removePlayer = async () => {
        const roomKey = localStorage.getItem('roomKey');
        const PlayerId = localStorage.getItem('playerId');
        if (!roomKey || !PlayerId) return;

        const playerRef = ref(db, `rooms/${roomKey}/players/${PlayerId}`);
        await remove(playerRef);

        localStorage.removeItem('roomKey');
        localStorage.removeItem('playerId');
    };

    return { removePlayer };
};

