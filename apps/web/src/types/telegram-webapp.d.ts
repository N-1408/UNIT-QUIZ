export {};

declare global {
  interface TelegramHapticFeedback {
    impactOccurred?: (style: "light" | "medium" | "heavy" | string) => void;
    notificationOccurred?: (type: "success" | "warning" | "error" | string) => void;
    selectionChanged?: () => void;
  }

  interface TelegramInitDataUnsafe {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      photo_url?: string;
      language_code?: string;
    };
    query_id?: string;
    auth_date?: number;
    hash?: string;
  }

  interface TelegramWebApp {
    initData?: string;
    initDataUnsafe?: TelegramInitDataUnsafe;
    ready: () => void;
    expand: () => void;
    setHeaderColor: (color: string) => void;
    close?: () => void;
    platform?: string;
    colorScheme?: "light" | "dark";
    HapticFeedback?: TelegramHapticFeedback;
  }

  interface TelegramNamespace {
    WebApp?: TelegramWebApp;
  }

  interface Window {
    Telegram?: TelegramNamespace;
  }
}
