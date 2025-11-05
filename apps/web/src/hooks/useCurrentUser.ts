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
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  createdAt: string;
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

      const raw = (await response.json()) as Partial<UserProfile>;

      return {
        telegramId: raw.telegramId ?? telegramId,
        firstName: raw.firstName ?? null,
        lastName: raw.lastName ?? null,
        phoneNumber: raw.phoneNumber ?? null,
        createdAt: raw.createdAt ?? ''
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
