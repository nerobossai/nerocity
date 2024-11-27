import { create } from "zustand";

interface InputState {
  searchText: string;
  setSearchText: (screen: string) => void;
}

export const useSearchStore = create<InputState>()((set) => ({
  searchText: "",
  setSearchText: (searchText: string) => set(() => ({ searchText })),
}));
