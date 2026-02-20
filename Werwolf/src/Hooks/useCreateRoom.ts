import { createRoomInDb } from '../Services/roomService';

export const useCreateRoom = () => {

  const createRoom = async () => {
    return await createRoomInDb();
  };

  return { createRoom };
};
