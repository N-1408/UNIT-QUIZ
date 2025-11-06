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
        "flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-text-secondary shadow-elev-sm transition duration-swift ease-fluid hover:-translate-x-0.5 hover:bg-surface-alt hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95",
        className
      )}
    >
      <ChevronLeft className="h-5 w-5" aria-hidden />
    </button>
  );
};
