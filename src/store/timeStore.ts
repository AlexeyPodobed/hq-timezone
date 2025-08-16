import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TimeState {
  is24h: boolean;
  set24h: (val: boolean) => void;
  toggle: () => void;
}

export const useTimeStore = create<TimeState>()(
  persist(
    (set, get) => ({
      is24h: true,
      set24h: (val) => set({ is24h: val }),
      toggle: () => set({ is24h: !get().is24h }),
    }),
    {
      name: "time-format-24h",
    }
  )
);
