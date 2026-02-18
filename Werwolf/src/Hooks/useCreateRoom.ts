import { ref, set } from 'firebase/database';
import { db } from '../firebase-config';

export const useCreateRoom = () => {

  const createRoom = async () => {
    const roomKey = Math.floor(Math.random() * 900000) + 100000;
    const roomRef = ref(db, `rooms/${roomKey}`);

    await set(roomRef, {
      created_at: new Date().toISOString(),
      players: {},
    });

    localStorage.setItem('roomKey', String(roomKey));
    return String(roomKey);
  };

  return { createRoom };
};
