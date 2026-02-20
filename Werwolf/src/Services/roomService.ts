import { ref, set } from 'firebase/database';
import { db } from '../firebase-config';

export async function createRoomInDb(): Promise<string> {
  const roomKey = Math.floor(Math.random() * 900000) + 100000;
  const roomRef = ref(db, `rooms/${roomKey}`);

  await set(roomRef, {
    created_at: new Date().toISOString(),
    players: {},
  });

  sessionStorage.setItem('roomKey', String(roomKey));
  return String(roomKey);
}

