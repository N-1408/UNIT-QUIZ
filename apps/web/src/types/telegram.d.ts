export {};

declare global {
  interface TelegramWebApp {
    ready: () => void;
    expand: () => void;
    colorScheme: "light" | "dark";
    themeParams?: {
      bg_color?: string;
      text_color?: string;
      hint_color?: string;
      secondary_bg_color?: string;
      button_color?: string;
      button_text_color?: string;
    };
    initDataUnsafe?: {
      user?: {
        id: number;
        first_name: string;
        last_name?: string;
        username?: string;
        photo_url?: string;
        language_code?: string;
      };
    };
    onEvent: (event: string, callback: () => void) => void;
    offEvent: (event: string, callback: () => void) => void;
    BackButton: {
      show: () => void;
      hide: () => void;
      onClick: (callback: () => void) => void;
      offClick: (callback: () => void) => void;
    };
    HapticFeedback?: {
      impactOccurred: (type: "light" | "medium" | "heavy") => void;
    };
    openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
  }

  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}
