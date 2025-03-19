import { create } from "zustand";

type UserStore = {
  isBoss: boolean;
  setIsBoss: (isBoss: boolean) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  isBoss: false,
  setIsBoss: (isBoss) => set({ isBoss }),
}));
