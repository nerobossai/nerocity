import { create } from "zustand";

interface ModalState {
  screen: number;
  setScreen: (screen: number) => void;
}

export const useScreenStore = create<ModalState>()((set) => ({
  screen: 0,
  setScreen: (screen: number) => set(() => ({ screen })),
}));
