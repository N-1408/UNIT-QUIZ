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

const STATUS_COPY: Record<ExamStatus, string> = {
  upcoming: "Tayyorgarlik uchun hali biroz vaqtimiz bor.",
  open: "Boshlashga tayyor! Zudlik bilan start olaylik.",
  closed: "Yakunlandi. Natijangiz Results bo‘limida."
};

const STATUS_BADGE: Record<ExamStatus, string> = {
  upcoming: "border-info/40 bg-info/10 text-info",
  open: "border-brand/40 bg-brand-light text-brand",
  closed: "border-accent-gray/60 bg-surface-alt text-text-muted"
};

const STATUS_LABEL: Record<ExamStatus, string> = {
  upcoming: "UPCOMING",
  open: "OPEN",
  closed: "CLOSED"
};

export const ExamCard = ({ exam, className }: ExamCardProps) => (
  <Link
    to={`/exams/${exam.id}`}
    className={cn(
      "group flex flex-col gap-4 rounded-[28px] border border-stroke/70 bg-surface p-5 text-left shadow-elev-sm transition duration-swift ease-fluid hover:-translate-y-0.5 hover:shadow-elev-md",
      className
    )}
  >
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-2">
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide",
            STATUS_BADGE[exam.status]
          )}
        >
          {STATUS_LABEL[exam.status]}
        </span>
        <h3 className="line-clamp-2 text-lg font-semibold text-text-primary transition group-hover:text-brand">
          {exam.title}
        </h3>
        <p className="text-sm text-text-secondary">{STATUS_COPY[exam.status]}</p>
      </div>
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-light text-brand shadow-elev-sm">
        <Star className="h-5 w-5" />
      </span>
    </div>
    <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary">
      {exam.startsAt ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-surface-alt px-3 py-1">
          <Clock className="h-4 w-4" />
          {formatTime(exam.startsAt)}
        </span>
      ) : null}
      <span className="inline-flex items-center gap-1 rounded-full bg-surface-alt px-3 py-1">
        <Clock className="h-4 w-4" />
        {formatDuration(exam.durationMinutes)}
      </span>
    </div>
  </Link>
);
