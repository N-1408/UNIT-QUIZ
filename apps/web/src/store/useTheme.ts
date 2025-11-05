import { create } from "zustand";

type Theme = "light" | "dark";

type ThemeState = {
  theme: Theme;
  source: "system" | "telegram" | "manual";
  setTheme: (theme: Theme) => void;
  setTelegramTheme: (theme: Theme) => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "light",
  source: "system",
  setTheme: (theme) => set({ theme, source: "manual" }),
  setTelegramTheme: (theme) => set({ theme, source: "telegram" })
}));
