import type { ReactNode } from "react";
import { BackButton } from "@/components/common/BackButton";
import { cn } from "@/lib/utils";

type HeaderProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  showBack?: boolean;
  className?: string;
};

export const Header = ({ title, subtitle, actions, showBack = true, className }: HeaderProps) => (
  <header
    className={cn(
      "sticky top-0 z-40 px-4 pb-4 pt-[calc(env(safe-area-inset-top)+1.25rem)] md:px-6 lg:px-10",
      className
    )}
  >
    <div className="relative flex flex-col gap-4 rounded-3xl border border-white/10 bg-surface/40 p-4 shadow-glass backdrop-blur-xl before:absolute before:inset-0 before:-z-10 before:rounded-3xl before:bg-gradient-to-br before:from-white/12 before:to-white/4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {showBack ? <BackButton /> : null}
          <div className="flex flex-col">
            <span className="text-xl font-semibold tracking-tight text-slate-100">{title}</span>
            {subtitle ? <span className="text-sm text-muted">{subtitle}</span> : null}
          </div>
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  </header>
);
