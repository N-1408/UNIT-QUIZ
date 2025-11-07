type TelegramBackButton = {
  show: () => void;
  hide: () => void;
  onClick: (callback: () => void) => void;
  offClick: (callback: () => void) => void;
};

export type TelegramUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
};

type TelegramInitData = {
  user?: TelegramUser;
};

type TelegramThemeParams = {
  bg_color?: string;
  text_color?: string;
  hint_color?: string;
  secondary_bg_color?: string;
  button_color?: string;
  button_text_color?: string;
};

type TelegramWebApp = {
  ready: () => void;
  expand: () => void;
  colorScheme: "light" | "dark";
  themeParams?: TelegramThemeParams;
  initDataUnsafe?: TelegramInitData;
  onEvent: (event: string, callback: () => void) => void;
  offEvent: (event: string, callback: () => void) => void;
  BackButton: TelegramBackButton;
  HapticFeedback?: {
    impactOccurred: (type: "light" | "medium" | "heavy") => void;
  };
};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

let webApp: TelegramWebApp | undefined;

export const initTelegramWebApp = () => {
  if (typeof window === "undefined") return;
  const tg = window.Telegram?.WebApp;
  if (!tg) return;
  webApp = tg;
  try {
    tg.ready();
    tg.expand();
  } catch (error) {
    console.warn("Telegram WebApp init failed", error);
  }
};

export type TelegramThemePayload = {
  colorScheme: "light" | "dark";
  themeParams?: TelegramThemeParams;
};

export const syncTelegramTheme = (listener: (payload: TelegramThemePayload) => void) => {
  if (!webApp) {
    listener({ colorScheme: "light", themeParams: undefined });
    return () => undefined;
  }

  const handler = () =>
    listener({
      colorScheme: webApp!.colorScheme ?? "light",
      themeParams: webApp?.themeParams
    });
  handler();
  webApp.onEvent("themeChanged", handler);
  return () => webApp?.offEvent("themeChanged", handler);
};

export const registerTelegramBackButton = (callback: () => void) => {
  if (!webApp) return () => undefined;
  const btn = webApp.BackButton;
  btn.show();
  btn.onClick(callback);
  return () => {
    btn.offClick(callback);
    btn.hide();
  };
};

export const triggerHaptic = (type: "light" | "medium" | "heavy" = "light") => {
  try {
    webApp?.HapticFeedback?.impactOccurred(type);
  } catch (error) {
    console.warn("Telegram haptic unavailable", error);
  }
};

export const getTelegramUser = (): TelegramUser | null => {
  if (!webApp) {
    const unsafe = window.Telegram?.WebApp?.initDataUnsafe;
    return unsafe?.user ?? null;
  }
  return webApp.initDataUnsafe?.user ?? null;
};
