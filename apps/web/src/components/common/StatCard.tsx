import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
  className?: string;
};

export const StatCard = ({ label, value, hint, icon, className }: StatCardProps) => (
  <article
    className={cn(
      "group flex flex-col gap-3 rounded-[20px] border border-border bg-surface/95 p-4 shadow-elev-sm transition duration-swift ease-fluid hover:scale-[0.98] hover:shadow-elev-md active:scale-[0.97]",
      className
    )}
  >
    <div className="flex items-center justify-between gap-2 text-xs font-medium uppercase tracking-wide text-text-secondary">
      <span>{label}</span>
      {icon ? (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-light text-base shadow-elev-sm">
          {icon}
        </span>
      ) : null}
    </div>
    <div className="text-2xl font-semibold tracking-tight text-text-primary">{value}</div>
    {hint ? <p className="text-xs text-text-secondary">{hint}</p> : null}
  </article>
);
