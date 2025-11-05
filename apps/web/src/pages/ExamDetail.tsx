import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { ExamDetailHeader } from "@/components/exams/ExamDetailHeader";
import { cn } from "@/lib/utils";

const RULES = [
  "Telefonni flight mode'ga o'tkazing",
  "Savollar orasida orqaga qaytmaymiz",
  "Topshirgandan keyin natija Results bo'limida paydo bo'ladi"
];

export const ExamDetailPage = () => {
  const { examId } = useParams();
  const startsAt = useMemo(() => new Date(Date.now() + 1000 * 60 * 15), []);

  return (
    <div className="flex flex-col gap-6">
      <ExamDetailHeader
        title={`Imtihon #${examId ?? "???"}`}
        durationMinutes={45}
        attemptsLeft={2}
        reviewPolicy="Natija faqat yakunlangach ko'rinadi"
        startsAt={startsAt}
        status="upcoming"
      />

      <section className="rounded-3xl bg-card/80 p-6 shadow-sm ring-1 ring-stroke">
        <h2 className="text-lg font-semibold text-slate-100">Qoidalar</h2>
        <ul className="mt-4 space-y-3 text-sm text-muted">
          {RULES.map((rule) => (
            <li key={rule} className="flex items-start gap-2">
              <span className="mt-1 text-brand">-</span>
              <span className="leading-relaxed">{rule}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className={cn(
            "rounded-3xl bg-brand px-6 py-3 text-sm font-semibold text-brand-ink shadow-md transition hover:bg-brand/90"
          )}
        >
          Boshlash
        </button>
        <button
          type="button"
          className="rounded-3xl border border-stroke px-6 py-3 text-sm font-medium text-muted transition hover:border-brand hover:text-slate-100"
        >
          Savollar bilan tanishish
        </button>
      </div>
    </div>
  );
};
