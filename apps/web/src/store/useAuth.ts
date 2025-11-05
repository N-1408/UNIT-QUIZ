import { create } from "zustand";

export type Role = "student" | "teacher" | "admin";

export type AuthPayload = {
  tgId: number;
  fullName: string;
  role: Role;
  token?: string;
};

type AuthState = {
  session: AuthPayload | null;
  setSession: (payload: AuthPayload) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  setSession: (payload) => set({ session: payload }),
  clearSession: () => set({ session: null })
}));
