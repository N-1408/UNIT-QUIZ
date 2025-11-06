import { cn } from "@/lib/utils";

type ResultStatus = "passed" | "failed" | "neutral";

type ResultCardProps = {
  title: string;
  score: number;
  status: ResultStatus;
  takenAt: Date;
};

const STATUS_META: Record<ResultStatus, { tone: string; message: string; emoji: string }> = {
  passed: {
    tone: "text-accent-green",
    message: "Zo'r ishladingiz!",
    emoji: "\uD83C\uDFC6"
  },
  failed: {
    tone: "text-text-secondary",
    message: "Bu safar omad keyingi safarga. \u2615\uFE0F",
    emoji: "\uD83D\uDE14"
  },
  neutral: {
    tone: "text-text-secondary",
    message: "Natija tez orada yangilanadi.",
    emoji: "\u23F3"
  }
};

export const ResultCard = ({ title, score, status, takenAt }: ResultCardProps) => {
  const meta = STATUS_META[status];

  return (
    <article className="flex items-center justify-between gap-4 rounded-[20px] border border-border bg-surface/95 px-4 py-3 shadow-elev-sm transition duration-swift ease-fluid hover:scale-[0.99] hover:shadow-elev-md active:scale-[0.98]">
      <div className="flex flex-1 items-center gap-3">
        <span className="text-lg" aria-hidden>
          {meta.emoji}
        </span>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
          <span className={cn("text-xs font-medium", meta.tone)}>{meta.message}</span>
          <span className="text-[11px] text-text-secondary">
            {takenAt.toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-full bg-brand-light px-3 py-1 text-sm font-semibold text-brand">
        <span>{score}%</span>
      </div>
    </article>
  );
};
