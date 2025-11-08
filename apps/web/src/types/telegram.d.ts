declare global {
  interface TelegramWebApp {
    openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
  }
}

export {};
