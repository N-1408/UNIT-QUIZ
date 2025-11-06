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
  open: "OPEN - Boshlash vaqti keldi, omad yor bo'lsin!",
  upcoming: "UPCOMING - Tayyor turamiz, start tez orada.",
  closed: "CLOSED - Yakunlandi, natijalarni Results bo'limida ko'rasiz."
};

const STATUS_ACCENTS: Record<ExamDetailHeaderProps["status"], string> = {
  open: "border-brand/40 bg-brand-light text-brand",
  upcoming: "border-info/40 bg-info/10 text-info",
  closed: "border-accent-gray/60 bg-surface-alt text-text-secondary"
};

export const ExamDetailHeader = ({
  title,
  durationMinutes,
  attemptsLeft,
  reviewPolicy,
  startsAt,
  status
}: ExamDetailHeaderProps) => (
  <section className="relative overflow-hidden rounded-[32px] border border-stroke/70 bg-surface p-6 shadow-elev-lg sm:p-8">
    <div className="pointer-events-none absolute inset-x-[-40%] top-[-50%] h-72 rounded-full bg-mesh-orange opacity-40 blur-3xl" />
    <div className="relative flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <span
          className={cn(
            "inline-flex w-fit items-center rounded-full border px-4 py-1 text-xs font-semibold tracking-wide",
            STATUS_ACCENTS[status]
          )}
        >
          {status.toUpperCase()}
        </span>
        <h1 className="text-3xl font-semibold leading-tight text-text-primary md:text-4xl">{title}</h1>
        <p className="text-sm text-text-secondary">
          Davomiylik:{" "}
          <span className="font-medium text-text-primary">{formatDuration(durationMinutes)}</span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary">
        {typeof attemptsLeft === "number" ? (
          <span className="rounded-full border border-stroke/60 bg-surface-alt px-3 py-1">
            Qolgan urinishlar: {attemptsLeft}
          </span>
        ) : null}
        {reviewPolicy ? (
          <span className="rounded-full border border-stroke/60 bg-surface-alt px-3 py-1">
            {reviewPolicy}
          </span>
        ) : null}
        {startsAt ? (
          <span className="rounded-full border border-stroke/60 bg-surface-alt px-3 py-1">
            Boshlanishi: {formatTime(startsAt)}
          </span>
        ) : null}
      </div>

      <div
        className={cn(
          "rounded-[22px] border px-4 py-4 text-sm font-medium text-text-primary shadow-elev-sm",
          STATUS_ACCENTS[status]
        )}
      >
        {status === "upcoming" && startsAt ? (
          <span className="flex items-center gap-3 text-text-secondary">
            <Countdown target={startsAt} />
            <span>sabr qiling, sal qoldi :)</span>
          </span>
        ) : (
          STATUS_TEXT[status]
        )}
      </div>
    </div>
  </section>
);
