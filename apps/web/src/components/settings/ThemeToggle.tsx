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
      className="flex w-full items-center justify-between rounded-[28px] border border-stroke/70 bg-surface px-5 py-4 text-left text-sm text-text-primary shadow-elev-sm transition duration-swift ease-fluid hover:border-brand/40"
    >
      <div className="flex flex-col gap-1">
        <span className="font-semibold">Tungi rejim</span>
        <span className="text-xs text-text-secondary">
          Ko'zingiz tinchroq bo'lishi uchun dark mode {isDark ? "yoqilgan" : "o'chirilayotgan"}.
        </span>
      </div>
      <span className="rounded-full border border-stroke/60 bg-surface-alt p-3 text-brand shadow-elev-sm">
        {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </span>
    </button>
  );
};
