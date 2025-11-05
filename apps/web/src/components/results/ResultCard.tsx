type ResultCardProps = {
  title: string;
  score: number;
  status: "passed" | "failed";
  takenAt: Date;
};

const STATUS_COPY = {
  passed: "✅ Ajoyib! Yutuq qahvasi sizdan ☕️",
  failed: "🙃 Xafa bo'lmang, bu faqat bir test xolos."
};

export const ResultCard = ({ title, score, status, takenAt }: ResultCardProps) => (
  <article className="flex flex-col gap-3 rounded-3xl bg-card/80 p-5 shadow-sm ring-1 ring-stroke">
    <header className="flex items-center justify-between gap-3">
      <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
      <span className="rounded-full bg-surface-2 px-3 py-1 text-sm text-muted">
        {takenAt.toLocaleDateString()}
      </span>
    </header>
    <p className="text-sm text-muted">{STATUS_COPY[status]}</p>
    <div className="text-4xl font-semibold text-slate-50">{score}%</div>
  </article>
);
