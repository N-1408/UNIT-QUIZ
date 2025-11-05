import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { registerTelegramBackButton } from "@/lib/telegram";

type BackButtonProps = {
  fallbackPath?: string;
  className?: string;
};

export const BackButton = ({ fallbackPath = "/", className }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallbackPath, { replace: true });
    }
  }, [fallbackPath, navigate]);

  useEffect(() => {
    const cleanup = registerTelegramBackButton(handleBack);
    window.addEventListener("popstate", handleBack);
    return () => {
      cleanup();
      window.removeEventListener("popstate", handleBack);
    };
  }, [handleBack]);

  return (
    <button
      type="button"
      aria-label="Orqaga"
      onClick={handleBack}
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-2xl border border-transparent bg-surface-2/80 text-slate-100 shadow-sm backdrop-blur transition hover:bg-surface-2/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:text-slate-100",
        "md:hover:-translate-x-0.5 md:hover:shadow-md",
        className
      )}
    >
      <ChevronLeft className="h-5 w-5" aria-hidden />
    </button>
  );
};
