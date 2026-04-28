import { create } from "zustand";

interface IconStore{
    icons: Record<string, string>;
    setIcons: (icons: Record<string, string>) => void;
}

export const useIconStore = create<IconStore>((set) => ({
    icons: {},
    setIcons: (icons) => set({ icons }),
}));

