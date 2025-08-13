import { create } from "zustand";

interface TimeState {
    is24h: boolean;
    set24h: (val: boolean) => void;
    toggle: () => void;
}

export const useTimeStore = create<TimeState>((set) => ({
    is24h: true,
    set24h: (val) => set({ is24h: val }),
    toggle: () => set((state) => ({ is24h: !state.is24h })),
}));
