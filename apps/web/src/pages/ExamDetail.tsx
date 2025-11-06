import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { ExamDetailHeader } from "@/components/exams/ExamDetailHeader";

const RULES = [
  "Telefonni flight mode'ga o'tkazing.",
  "Savollar orasida orqaga qaytmaymiz.",
  "Topshirgandan keyin natija Results bo'limida paydo bo'ladi."
];

export const ExamDetailPage = () => {
  const { examId } = useParams();
  const startsAt = useMemo(() => new Date(Date.now() + 1000 * 60 * 15), []);

  return (
    <div className="flex flex-col gap-5">
      <ExamDetailHeader
        title={`Imtihon #${examId ?? "???"}`}
        durationMinutes={45}
        attemptsLeft={2}
        reviewPolicy="Natija yakunlangach ochiladi"
        startsAt={startsAt}
        status="upcoming"
      />

      <section className="rounded-[20px] border border-border bg-surface/95 p-4 shadow-elev-sm">
        <h2 className="text-base font-semibold text-text-primary">Qoidalar</h2>
        <ul className="mt-3 space-y-2 text-sm text-text-secondary">
          {RULES.map((rule) => (
            <li key={rule} className="flex items-start gap-2">
              <span className="mt-[6px] text-brand">-</span>
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-brand-ink shadow-elev-sm transition duration-swift ease-fluid hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:scale-95"
        >
          Boshlash
        </button>
        <button
          type="button"
          className="rounded-full border border-border bg-surface px-5 py-2 text-sm font-medium text-text-secondary transition duration-swift ease-fluid hover:border-brand/40 hover:text-text-primary active:scale-95"
        >
          Savollar bilan tanishish
        </button>
      </div>
    </div>
  );
};
