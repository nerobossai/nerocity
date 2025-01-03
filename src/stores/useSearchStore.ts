import { create } from "zustand";

interface InputState {
  searchText: string;
  setSearchText: (screen: string) => void;
  displaySearchResults: boolean;
  setDisplaySearchResults: (displaySearchResults: boolean) => void;
}

export const useSearchStore = create<InputState>()((set) => ({
  searchText: "",
  setSearchText: (searchText: string) => set(() => ({ searchText })),
  displaySearchResults: false,
  setDisplaySearchResults: (displaySearchResults: boolean) =>
    set(() => ({ displaySearchResults })),
}));
