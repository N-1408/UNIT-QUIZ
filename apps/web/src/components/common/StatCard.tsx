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
      "group flex flex-col gap-4 rounded-[28px] border border-stroke/70 bg-surface p-5 shadow-elev-sm transition duration-swift ease-fluid hover:-translate-y-0.5 hover:shadow-elev-md",
      className
    )}
  >
    <div className="flex items-center justify-between gap-3 text-sm font-medium text-text-secondary">
      <span>{label}</span>
      {icon ? (
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-light text-lg shadow-elev-sm">
          {icon}
        </span>
      ) : null}
    </div>
    <div className="text-3xl font-semibold tracking-tight text-text-primary">{value}</div>
    {hint ? <p className="text-xs text-text-secondary">{hint}</p> : null}
  </article>
);
