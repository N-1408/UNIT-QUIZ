import { create } from "zustand";
import type { LanguageCode } from "@/store/useLanguage";
import { apiClient } from "@/lib/apiClient";
import type { UserProfileResponse } from "@/types/api";

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

type SyncSessionInput = {
  telegramId: number;
  fullName: string;
  username: string | null;
  language?: LanguageCode;
  phoneNumber?: string | null;
  role?: string | null;
};

type AuthState = {
  session: AuthPayload | null;
  status: AuthStatus;
  error: string | null;
  setSession: (payload: AuthPayload | null) => void;
  setStatus: (status: AuthStatus, error?: string | null) => void;
  clearSession: () => void;
  syncSession: (input: SyncSessionInput) => Promise<AuthPayload | null>;
};

const parseLanguage = (value?: string | null): LanguageCode | null => {
  if (value === "uz" || value === "ru" || value === "en") {
    return value;
  }
  return null;
};

const parseRole = (value?: string | null): Role => {
  if (value === "teacher" || value === "admin") {
    return value;
  }
  return "student";
};

const toAuthPayload = (
  profile: UserProfileResponse,
  fallback: SyncSessionInput
): AuthPayload => ({
  tgId: profile.tgId,
  fullName: profile.fullName || fallback.fullName,
  firstName: profile.firstName ?? null,
  lastName: profile.lastName ?? null,
  username: profile.tgUsername ?? fallback.username,
  phoneNumber: profile.phoneNumber ?? fallback.phoneNumber ?? null,
  role: parseRole(profile.role ?? fallback.role ?? null),
  language: parseLanguage(profile.lang) ?? fallback.language ?? "uz",
  createdAt: profile.createdAt,
  token: null
});

export const useAuthStore = create<AuthState>((set, _get) => ({
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
    }),
  syncSession: async (input) => {
    set({ status: "loading", error: null });
    const response = await apiClient.syncUser({
      telegramId: input.telegramId,
      fullName: input.fullName,
      username: input.username,
      language: input.language,
      phoneNumber: input.phoneNumber,
      role: input.role
    });

    if (response.success && response.data) {
      const payload = toAuthPayload(response.data, input);
      set({ session: payload, status: "ready", error: null });
      return payload;
    }

    set({
      status: "error",
      error: response.error ?? "Auth sync failed"
    });
    return null;
  }
}));
