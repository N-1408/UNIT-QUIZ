import { create } from "zustand";
import type { LanguageCode } from "@/store/useLanguage";

export type Role = "student" | "teacher" | "admin";

export type AuthPayload = {
  tgId: number;
  fullName: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  phoneNumber: string | null;
  role: Role;
  language: LanguageCode | null;
  createdAt: string | null;
  token?: string | null;
};

export type AuthStatus = "idle" | "loading" | "ready" | "error";

type AuthState = {
  session: AuthPayload | null;
  status: AuthStatus;
  error: string | null;
  setSession: (payload: AuthPayload | null) => void;
  setStatus: (status: AuthStatus, error?: string | null) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  status: "idle",
  error: null,
  setSession: (payload) => set({ session: payload }),
  setStatus: (status, error = null) => set({ status, error }),
  clearSession: () =>
    set({
      session: null,
      status: "idle",
      error: null
    })
}));
