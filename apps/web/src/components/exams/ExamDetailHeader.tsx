import { Countdown } from "@/components/common/Countdown";
import { cn, formatDuration, formatTime } from "@/lib/utils";

type ExamDetailHeaderProps = {
  title: string;
  durationMinutes: number;
  attemptsLeft?: number | null;
  reviewPolicy?: string | null;
  startsAt?: Date | null;
  status: "upcoming" | "open" | "closed";
};

export const ExamDetailHeader = ({
  title,
  durationMinutes,
  attemptsLeft,
  reviewPolicy,
  startsAt,
  status
}: ExamDetailHeaderProps) => (
  <section className="flex flex-col gap-4 rounded-3xl bg-card/80 p-6 shadow-md ring-1 ring-stroke">
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-semibold text-slate-100">{title}</h1>
      <p className="text-sm text-muted">Davomiylik: {formatDuration(durationMinutes)}</p>
    </div>

    <div className="flex flex-wrap items-center gap-2 text-xs">
      {typeof attemptsLeft === "number" ? (
        <span className="rounded-full bg-surface-2 px-3 py-1 text-slate-200">
          Qolgan urinishlar: {attemptsLeft}
        </span>
      ) : null}
      {reviewPolicy ? (
        <span className="rounded-full bg-surface-2 px-3 py-1 text-slate-200">{reviewPolicy}</span>
      ) : null}
      {startsAt ? (
        <span className="rounded-full bg-surface-2 px-3 py-1 text-slate-200">
          Boshlanishi: {formatTime(startsAt)}
        </span>
      ) : null}
    </div>

    <div
      className={cn(
        "rounded-2xl px-4 py-3 text-sm font-medium",
        status === "open" && "bg-brand/20 text-brand",
        status === "upcoming" && "bg-surface-2 text-slate-200",
        status === "closed" && "bg-surface-2 text-muted"
      )}
    >
      {status === "open" && "OPEN — Qani ko'ramiz, kim haqiqiy yulduz ??"}
      {status === "closed" && "?? Imtihon yakunlangan. Natijangizni 'Results'da ko'rasiz."}
      {status === "upcoming" && startsAt ? (
        <span className="flex items-center gap-2">
          ? <Countdown target={startsAt} /> — sabr qiling, sal qoldi :)
        </span>
      ) : null}
    </div>
  </section>
);
