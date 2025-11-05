export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
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
  const user = tg.initDataUnsafe?.user ?? null;

  return { tg, initData: initData ?? "", user };
};
