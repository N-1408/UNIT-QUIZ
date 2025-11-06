import { Link } from "react-router-dom";
import { Clock, Star } from "lucide-react";
import { cn, formatDuration, formatTime } from "@/lib/utils";

export type ExamStatus = "upcoming" | "open" | "closed";

export type ExamSummary = {
  id: number;
  title: string;
  startsAt: Date | null;
  durationMinutes: number;
  status: ExamStatus;
};

type ExamCardProps = {
  exam: ExamSummary;
  className?: string;
};

const STATUS_META: Record<ExamStatus, { label: string; hint: string; chipClass: string }> = {
  upcoming: {
    label: "UPCOMING",
    hint: "Tayyorgarlik uchun hali vaqt bor.",
    chipClass: "bg-brand-light/70 text-brand"
  },
  open: {
    label: "OPEN",
    hint: "Boshlashga tayyor! Tezroq ulaning.",
    chipClass: "bg-brand text-brand-ink"
  },
  closed: {
    label: "CLOSED",
    hint: "Yakunlandi. Natijangiz Results bo'limida.",
    chipClass: "bg-surface-alt text-text-secondary"
  }
};

export const ExamCard = ({ exam, className }: ExamCardProps) => {
  const meta = STATUS_META[exam.status];

  return (
    <Link
      to={`/exams/${exam.id}`}
      className={cn(
        "group flex min-h-[132px] flex-col justify-between gap-3 rounded-[20px] border border-border bg-surface/95 p-4 text-left shadow-elev-sm transition duration-swift ease-fluid hover:scale-[0.99] hover:shadow-elev-md active:scale-[0.97]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
            <span className={cn("inline-flex items-center rounded-full px-2.5 py-1", meta.chipClass)}>
              {meta.label}
            </span>
            {exam.startsAt ? (
              <span className="rounded-full bg-surface-alt px-2.5 py-1 text-text-secondary">
                {formatTime(exam.startsAt)}
              </span>
            ) : null}
          </div>
          <h3 className="line-clamp-2 text-base font-semibold text-text-primary transition group-hover:text-brand">
            {exam.title}
          </h3>
          <p className="text-xs text-text-secondary">{meta.hint}</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-light text-brand shadow-elev-sm">
          <Star className="h-5 w-5" />
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-[11px] text-text-secondary">
        <span className="inline-flex items-center gap-1 rounded-full bg-surface-alt px-3 py-1">
          <Clock className="h-4 w-4" />
          {formatDuration(exam.durationMinutes)}
        </span>
      </div>
    </Link>
  );
};
