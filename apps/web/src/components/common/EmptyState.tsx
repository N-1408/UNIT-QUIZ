import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
};

export const EmptyState = ({ title, description, icon, className }: EmptyStateProps) => {
  const visual = icon ?? "😎";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-[24px] border border-dashed border-border bg-surface px-6 py-10 text-center text-sm text-text-secondary shadow-elev-sm",
        className
      )}
    >
      <div className="text-4xl">{visual}</div>
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      {description ? <p className="max-w-sm text-sm text-text-secondary">{description}</p> : null}
    </div>
  );
};
