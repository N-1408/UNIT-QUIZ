import { cn } from "@/lib/utils";

type ResultStatus = "passed" | "failed" | "neutral";

type ResultCardProps = {
  title: string;
  score: number;
  status: ResultStatus;
  takenAt: Date;
};

const STATUS_COPY: Record<ResultStatus, string> = {
  passed: "Ajoyib! Yutuq choyi sizdan.",
  failed: "Xafa bo'lmang, bu faqat bir test xolos.",
  neutral: "Bu sinov yakuniy natija emas, keyingi safar albatta!"
};

const STATUS_BADGE: Record<ResultStatus, string> = {
  passed: "border-ok/40 bg-ok/10 text-ok",
  failed: "border-danger/40 bg-danger/10 text-danger",
  neutral: "border-stroke/60 bg-surface-alt text-text-secondary"
};

export const ResultCard = ({ title, score, status, takenAt }: ResultCardProps) => (
  <article className="flex flex-col gap-4 rounded-[28px] border border-stroke/70 bg-surface p-5 shadow-elev-sm">
    <header className="flex items-center justify-between gap-3">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        <span className="text-sm text-text-secondary">{STATUS_COPY[status]}</span>
      </div>
      <span
        className={cn(
          "rounded-full border px-3 py-1 text-xs font-semibold tracking-wide",
          STATUS_BADGE[status]
        )}
      >
        {takenAt.toLocaleDateString()}
      </span>
    </header>
    <div className="text-4xl font-semibold text-text-primary">{score}%</div>
  </article>
);
