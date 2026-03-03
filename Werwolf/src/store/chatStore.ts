 import { create } from "zustand";

export const CHAT_WIDTH = 400;

interface ChatStore {
    collapsed: boolean;
    setCollapsed: (v: boolean) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
    collapsed: false,
    setCollapsed: (v) => set({ collapsed: v }),
}));

