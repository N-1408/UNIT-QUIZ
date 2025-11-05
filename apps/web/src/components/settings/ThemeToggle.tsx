import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/store/useTheme";

export const ThemeToggle = () => {
  const { theme, setTheme } = useThemeStore();
  const isDark = theme === "dark";

  const toggle = () => setTheme(isDark ? "light" : "dark");

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex w-full items-center justify-between rounded-3xl border border-stroke bg-card/80 px-5 py-4 text-left text-sm text-slate-100 shadow-sm transition hover:border-brand"
    >
      <div className="flex flex-col gap-1">
        <span className="font-semibold">Tungi rejim</span>
        <span className="text-xs text-muted">
          🌙 Ko'zingiz tinchroq bo'lishi uchun Dark Mode {isDark ? "yoqildi!" : "o'chiriladi!"}
        </span>
      </div>
      <span className="rounded-full bg-surface-2 p-3 text-brand">
        {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </span>
    </button>
  );
};
