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
      "flex flex-col gap-3 rounded-3xl bg-card/80 p-5 shadow-sm ring-1 ring-stroke backdrop-blur transition hover:shadow-md",
      className
    )}
  >
    <div className="flex items-center justify-between gap-3 text-sm text-muted">
      <span>{label}</span>
      {icon}
    </div>
    <div className="text-3xl font-semibold tracking-tight text-slate-50">{value}</div>
    {hint ? <p className="text-xs text-muted">{hint}</p> : null}
  </article>
);
