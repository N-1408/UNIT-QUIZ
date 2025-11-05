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
      className="flex w-full items-center justify-between rounded-3xl border border-white/10 bg-white/10 px-5 py-4 text-left text-sm text-slate-100 shadow-lg shadow-black/20 backdrop-blur-xl transition duration-soft ease-fluid hover:border-brand/40 dark:border-white/5"
    >
      <div className="flex flex-col gap-1">
        <span className="font-semibold">Tungi rejim</span>
        <span className="text-xs text-muted">
          ?? Ko'zingiz tinchroq bo'lishi uchun Dark Mode {isDark ? "yoqildi!" : "o'chiriladi!"}
        </span>
      </div>
      <span className="rounded-full border border-white/10 bg-white/10 p-3 text-brand shadow-sm backdrop-blur">
        {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </span>
    </button>
  );
};
