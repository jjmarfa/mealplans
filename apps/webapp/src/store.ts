import { User } from "@social-recipes/core";
import { create } from "zustand";

export const useAuthState = create<{
  user: User | null;
  loaded: boolean;
  setUser: (user: User | null) => void;
}>((set) => ({
  user: null,
  loaded: false,
  setUser: (user: User | null) => set({ user, loaded: true }),
}));
