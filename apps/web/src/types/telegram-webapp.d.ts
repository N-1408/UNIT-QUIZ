export {};

declare global {
  interface TelegramHapticFeedback {
    impactOccurred?: (style: "light" | "medium" | "heavy" | string) => void;
    notificationOccurred?: (type: "success" | "warning" | "error" | string) => void;
    selectionChanged?: () => void;
  }

  interface TelegramWebApp {
    initData?: string;
    ready: () => void;
    expand: () => void;
    setHeaderColor: (color: string) => void;
    HapticFeedback?: TelegramHapticFeedback;
  }

  interface TelegramNamespace {
    WebApp?: TelegramWebApp;
  }

  interface Window {
    Telegram?: TelegramNamespace;
  }
}

