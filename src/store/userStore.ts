// Should be deleted, but i will do it when server will work

import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserStore = {
  isBoss: boolean;
  setIsBoss: (isBoss: boolean) => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      isBoss: false,
      setIsBoss: (isBoss) => set({ isBoss }),
    }),
    {
      name: "user-storage",
    }
  )
);