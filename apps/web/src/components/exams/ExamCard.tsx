import { Link } from "react-router-dom";
import { Clock, Star } from "lucide-react";
import { cn, formatDuration, formatTime } from "@/lib/utils";
import type { ExamStatus } from "@/types/api";
export type { ExamStatus } from "@/types/api";

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
      to={`/exam/${exam.id}`}
      className={cn(
        "group relative flex min-h-[140px] flex-col justify-between gap-4 overflow-hidden rounded-[24px] bg-surface/80 p-5 text-left backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-brand/20",
        className
      )}
    >
      {/* Gradient Border Effect */}
      <div className="absolute inset-0 rounded-[24px] border border-white/10 bg-gradient-to-br from-white/20 to-transparent opacity-100 transition-opacity duration-300 group-hover:opacity-0" />
      <div className="absolute inset-0 rounded-[24px] p-[1px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-br from-brand via-brand/50 to-transparent" style={{ mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', maskComposite: 'exclude' }} />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
            <span className={cn("inline-flex items-center rounded-full px-3 py-1 shadow-sm backdrop-blur-sm", meta.chipClass)}>
              {meta.label}
            </span>
            {exam.startsAt ? (
              <span className="rounded-full bg-surface-alt/80 px-3 py-1 text-text-secondary backdrop-blur-sm">
                {formatTime(exam.startsAt)}
              </span>
            ) : null}
          </div>
          <h3 className="line-clamp-2 text-lg font-bold text-text-primary transition-colors group-hover:text-brand">
            {exam.title}
          </h3>
          <p className="text-xs font-medium text-text-secondary/80">{meta.hint}</p>
        </div>
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-light to-white text-brand shadow-md ring-1 ring-white/50 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
          <Star className="h-6 w-6 fill-current" />
        </span>
      </div>

      <div className="relative z-10 flex flex-wrap items-center gap-2 text-xs font-medium text-text-secondary">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-alt/50 px-3 py-1.5 backdrop-blur-sm transition-colors group-hover:bg-brand-light/50 group-hover:text-brand-dark">
          <Clock className="h-4 w-4" />
          {formatDuration(exam.durationMinutes)}
        </span>
      </div>
    </Link>
  );
};

