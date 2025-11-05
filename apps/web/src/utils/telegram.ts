export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
  auth_date?: number;
  hash?: string;
}

type TelegramInitResult = {
  tg: ReturnType<typeof getTelegramWebApp>;
  initData: string;
  user: TelegramUser | null;
};

export const getTelegramWebApp = () => window.Telegram?.WebApp ?? null;

export const initTelegramApp = (): TelegramInitResult => {
  const tg = getTelegramWebApp();
  if (!tg) {
    return { tg: null, initData: "", user: null };
  }

  try {
    tg.ready?.();
  } catch {
    /* noop */
  }

  try {
    tg.expand?.();
  } catch {
    /* noop */
  }

  const initData = tg.initData ?? window.Telegram?.WebApp?.initData ?? "";
  const raw = tg.initDataUnsafe;
  const user = raw?.user
    ? {
        id: raw.user.id,
        first_name: raw.user.first_name ?? "",
        last_name: raw.user.last_name ?? undefined,
        username: raw.user.username ?? undefined,
        language_code: raw.user.language_code ?? undefined,
        photo_url: raw.user.photo_url ?? undefined,
        auth_date: raw.auth_date,
        hash: raw.hash,
      }
    : null;

  return { tg, initData: initData ?? "", user };
};
