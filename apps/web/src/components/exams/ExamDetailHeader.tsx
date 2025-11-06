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

const STATUS_TEXT: Record<ExamDetailHeaderProps["status"], string> = {
  open: "OPEN — Boshlash vaqti keldi, omad yor bo'lsin!",
  upcoming: "UPCOMING — Tez orada start, tayyor turamiz.",
  closed: "CLOSED — Yakunlandi, natijani Results bo'limidan topasiz."
};

const STATUS_STYLE: Record<ExamDetailHeaderProps["status"], string> = {
  open: "border-brand/30 bg-brand-light text-brand",
  upcoming: "border-accent-blue/30 bg-accent-blue/10 text-accent-blue",
  closed: "border-border bg-surface-alt text-text-secondary"
};

export const ExamDetailHeader = ({
  title,
  durationMinutes,
  attemptsLeft,
  reviewPolicy,
  startsAt,
  status
}: ExamDetailHeaderProps) => (
  <section className="rounded-[24px] border border-border bg-surface/95 p-5 shadow-elev-sm sm:p-6">
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
          Imtihon tafsilotlari
        </span>
        <h1 className="text-2xl font-semibold leading-tight text-text-primary sm:text-3xl">{title}</h1>
        <p className="text-sm text-text-secondary">
          Davomiylik: <span className="font-medium text-text-primary">{formatDuration(durationMinutes)}</span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary">
        {typeof attemptsLeft === "number" ? (
          <span className="rounded-full border border-border bg-surface-alt px-3 py-1">
            Qolgan urinishlar: {attemptsLeft}
          </span>
        ) : null}
        {reviewPolicy ? (
          <span className="rounded-full border border-border bg-surface-alt px-3 py-1">{reviewPolicy}</span>
        ) : null}
        {startsAt ? (
          <span className="rounded-full border border-border bg-surface-alt px-3 py-1">
            Boshlanishi: {formatTime(startsAt)}
          </span>
        ) : null}
      </div>

      <div
        className={cn(
          "rounded-[18px] border px-4 py-3 text-sm font-medium shadow-elev-sm",
          STATUS_STYLE[status]
        )}
      >
        {status === "upcoming" && startsAt ? (
          <span className="flex items-center gap-2 text-current">
            <Countdown target={startsAt} />
            <span>Sabr qiling, sal qoldi.</span>
          </span>
        ) : (
          STATUS_TEXT[status]
        )}
      </div>
    </div>
  </section>
);
