import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { buildApiUrl } from "../lib/api";

export type TelegramUser =
  | null
  | {
      id: number;
      first_name?: string;
      last_name?: string;
      username?: string;
      photo_url?: string;
    };

export type UserProfile = {
  telegramId: string;
  tgId: number;
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  tgUsername: string | null;
  phoneNumber: string | null;
  lang: string | null;
  role: string | null;
  createdAt: string | null;
};

export class NotRegisteredError extends Error {
  constructor() {
    super("user_not_registered");
    this.name = "NotRegisteredError";
  }
}

function readTelegramUser(): TelegramUser {
  if (typeof window === "undefined") return null;
  const tgApp = window.Telegram?.WebApp;
  if (!tgApp) return null;
  const unsafeUser = tgApp.initDataUnsafe?.user;
  if (unsafeUser && typeof unsafeUser.id === "number") {
    return unsafeUser;
  }
  return null;
}

export function useCurrentUser() {
  const telegramUser = useMemo(() => readTelegramUser(), []);
  const telegramId = telegramUser?.id ? String(telegramUser.id) : null;

  const query = useQuery<UserProfile>({
    queryKey: ["nova-user", telegramId],
    queryFn: async () => {
      if (!telegramId) {
        throw new Error("missing_telegram_id");
      }

      const response = await fetch(buildApiUrl(`/api/users/${telegramId}`));

      if (response.status === 404) {
        throw new NotRegisteredError();
      }

      if (!response.ok) {
        const message = await response.text().catch(() => "failed_to_load_profile");
        throw new Error(message || "failed_to_load_profile");
      }

      const raw = (await response.json()) as Partial<UserProfile> & {
        tgId?: number;
        tgUsername?: string | null;
        lang?: string | null;
        role?: string | null;
        fullName?: string | null;
      };

      const fullName = raw.fullName ?? null;
      const providedFirst = raw.firstName ?? null;
      const providedLast = raw.lastName ?? null;

      let inferredFirst: string | null = providedFirst;
      let inferredLast: string | null = providedLast;

      if ((!providedFirst || !providedLast) && fullName) {
        const segments = fullName.trim().split(/\s+/);
        if (!providedFirst && segments.length > 0) {
          inferredFirst = segments[0] ?? null;
        }
        if (!providedLast && segments.length > 1) {
          inferredLast = segments.slice(1).join(" ") || null;
        }
      }

      return {
        telegramId: raw.telegramId ?? telegramId,
        tgId: raw.tgId ?? Number(telegramId),
        fullName,
        firstName: inferredFirst,
        lastName: inferredLast,
        tgUsername: raw.tgUsername ?? null,
        phoneNumber: raw.phoneNumber ?? null,
        lang: raw.lang ?? null,
        role: raw.role ?? null,
        createdAt: raw.createdAt ?? null
      };
    },
    enabled: Boolean(telegramId),
    retry: false,
    staleTime: 30_000
  });

  const needsRegistration = query.error instanceof NotRegisteredError;

  const status: "no-telegram" | "loading" | "needs-registration" | "ready" | "error" = (() => {
    if (!telegramId) return "no-telegram";
    if (query.isLoading) return "loading";
    if (needsRegistration) return "needs-registration";
    if (query.data) return "ready";
    if (query.error) return "error";
    return "loading";
  })();

  return {
    telegramUser,
    telegramId,
    profile: query.data ?? null,
    status,
    needsRegistration,
    isLoading: status === "loading",
    isError: status === "error",
    refetch: query.refetch,
    error: query.error instanceof NotRegisteredError ? null : query.error
  };
}
