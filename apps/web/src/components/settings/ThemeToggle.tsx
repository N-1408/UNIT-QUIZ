import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

type ThemeToggleProps = {
  className?: string;
};

export const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const toggle = () => setTheme(isDark ? "light" : "dark");

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block">
        {isDark ? "Dark Mode" : "Light Mode"}
      </span>
      <button
        type="button"
        onClick={toggle}
        className={cn(
          "relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
          isDark ? "bg-brand" : "bg-slate-200"
        )}
      >
        <span className="sr-only">Toggle theme</span>
        <span
          className={cn(
            "pointer-events-none relative inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
            isDark ? "translate-x-5" : "translate-x-0"
          )}
        >
          <span
            className={cn(
              "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity",
              isDark ? "opacity-0 duration-100 ease-out" : "opacity-100 duration-200 ease-in"
            )}
            aria-hidden="true"
          >
            <Sun className="h-3 w-3 text-yellow-500" />
          </span>
          <span
            className={cn(
              "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity",
              isDark ? "opacity-100 duration-200 ease-in" : "opacity-0 duration-100 ease-out"
            )}
            aria-hidden="true"
          >
            <Moon className="h-3 w-3 text-brand" />
          </span>
        </span>
      </button>
    </div>
  );
};
