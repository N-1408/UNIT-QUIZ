import { useEffect, useState, type ReactNode } from "react";
import { BackButton } from "@/components/common/BackButton";
import { cn } from "@/lib/utils";

type HeaderProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  showBack?: boolean;
  className?: string;
};

export const Header = ({ title, subtitle, actions, showBack = true, className }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex flex-col bg-surface transition duration-swift ease-fluid",
        isScrolled ? "shadow-elev-sm" : "shadow-none",
        className
      )}
    >
      <div className="h-[env(safe-area-inset-top)]" aria-hidden />
      <div
        className={cn(
          "border-b border-border px-4 pb-4 pt-4 transition duration-swift ease-fluid sm:px-6 lg:px-12",
          isScrolled ? "bg-surface" : "bg-surface"
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {showBack ? <BackButton /> : null}
            <div className="flex flex-col">
              <span className="text-xl font-semibold leading-tight text-text-primary">{title}</span>
              {subtitle ? (
                <span className="text-sm text-text-secondary">{subtitle}</span>
              ) : null}
            </div>
          </div>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </div>
      </div>
    </header>
  );
};
