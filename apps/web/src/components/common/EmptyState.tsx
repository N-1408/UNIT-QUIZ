import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
};

export const EmptyState = ({ title, description, icon, className }: EmptyStateProps) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-stroke/60 bg-card/40 px-6 py-12 text-center text-sm text-muted backdrop-blur",
      className
    )}
  >
    {icon && <div className="text-3xl">{icon}</div>}
    <h3 className="text-base font-semibold text-slate-200">{title}</h3>
    {description ? <p className="max-w-sm text-sm text-muted">{description}</p> : null}
  </div>
);
