export {};

declare global {
  interface TelegramWebApp {
    openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
  }

  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}
