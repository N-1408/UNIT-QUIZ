import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
};

export const EmptyState = ({ title, description, icon, className }: EmptyStateProps) => {
  const visual = icon ?? "??";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-white/10 bg-white/10 px-6 py-12 text-center text-sm text-muted shadow-md backdrop-blur-xl dark:border-white/5",
        className
      )}
    >
      <div className="text-3xl drop-shadow-glow">{visual}</div>
      <h3 className="text-base font-semibold text-slate-100">{title}</h3>
      {description ? <p className="max-w-sm text-sm text-muted">{description}</p> : null}
    </div>
  );
};
