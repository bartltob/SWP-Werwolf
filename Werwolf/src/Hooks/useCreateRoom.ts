import { useNavigate } from 'react-router-dom';
import { ref, set } from 'firebase/database';
import { db } from '../firebase-config';

export const useCreateRoom = () => {
  const navigate = useNavigate();

  const createRoom = async () => {
    const roomKey = Math.floor(Math.random() * 900000) + 100000;
    const roomRef = ref(db, `rooms/${roomKey}`);

    await set(roomRef, {
      created_at: new Date().toISOString(),
      players: {},
      status: 'waiting',
    });

    localStorage.setItem('roomKey', String(roomKey));

    navigate('/GamePage');
  };

  return { createRoom };
};

