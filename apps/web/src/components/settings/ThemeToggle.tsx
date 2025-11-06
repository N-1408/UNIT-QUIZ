import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/store/useTheme";

type ThemeToggleProps = {
  className?: string;
};

export const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const { theme, setTheme } = useThemeStore();
  const isDark = theme === "dark";

  const toggle = () => setTheme(isDark ? "light" : "dark");

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "flex w-full items-center justify-between rounded-[16px] border border-border bg-surface-alt px-4 py-3 text-left text-sm text-text-primary transition duration-swift ease-fluid hover:border-brand/40 active:scale-[0.99]",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-light text-brand">
          {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </span>
        <div className="flex flex-col gap-0.5 text-left">
          <span className="text-sm font-semibold">Tungi rejim</span>
          <span className="text-xs text-text-secondary">
            Dark mode {isDark ? "yoqilgan" : "o'chirilgan"}.
          </span>
        </div>
      </div>
      <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
        {isDark ? "ON" : "OFF"}
      </span>
    </button>
  );
};
