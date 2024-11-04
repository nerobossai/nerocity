import { createStore } from "zustand/vanilla";

import createBoundedUseStore from "@/utils/createBoundedUseStore";

type State = {
  profile: any;
  isAuthenticated: boolean;
  token: string;
};

type Action = {
  setUserProfile: (profile: any) => void;
  setToken: (token: string) => void;
  setAuthenticated: (val: boolean) => void;
  reset: () => void;
};

// using createStore from zustand/vanilla instead of store because we want to use this state outside of react components
export const userStore = createStore<State & Action>()((set) => ({
  token: "",
  profile: {},
  isAuthenticated: false,
  setUserProfile: (profile: object) =>
    set(() => ({
      profile,
    })),
  setToken: (token) =>
    set(() => ({
      token,
    })),
  setAuthenticated: (isAuthenticated) =>
    set(() => ({
      isAuthenticated,
    })),
  reset: () =>
    set(() => ({
      profile: {},
      token: "",
      isAuthenticated: false,
    })),
}));

// Create a hook to be used inside react components
const useUserStore = createBoundedUseStore(userStore);

export default useUserStore;
