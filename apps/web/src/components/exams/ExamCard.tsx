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
  upcoming: "⏳ Hali tayyorlanishga vaqt bor",
  open: "⭐️ Qani ko'ramiz, kim haqiqiy yulduz",
  closed: "📕 Yakunlangan, natijani ko'ring"
};

export const ExamCard = ({ exam, className }: ExamCardProps) => (
  <Link
    to={`/exams/${exam.id}`}
    className={cn(
      "group flex flex-col gap-4 rounded-3xl bg-card/80 p-5 shadow-sm ring-1 ring-stroke transition hover:-translate-y-0.5 hover:shadow-lg",
      className
    )}
  >
    <div className="flex items-start justify-between gap-3">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-slate-100 transition group-hover:text-brand">
          {exam.title}
        </h3>
        <p className="text-sm text-muted">{STATUS_COPY[exam.status]}</p>
      </div>
      <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand/20 text-brand">
        <Star className="h-4 w-4" />
      </span>
    </div>
    <div className="flex items-center gap-4 text-xs text-muted">
      {exam.startsAt ? (
        <span className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          {formatTime(exam.startsAt)}
        </span>
      ) : null}
      <span className="flex items-center gap-1">
        <Clock className="h-4 w-4" />
        {formatDuration(exam.durationMinutes)}
      </span>
    </div>
  </Link>
);
