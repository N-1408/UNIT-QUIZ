import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { ExamDetailHeader } from "@/components/exams/ExamDetailHeader";

const RULES = [
  "Telefonni flight mode'ga o'tkazing",
  "Savollar orasida orqaga qaytmaymiz",
  "Topshirgandan keyin natija Results bo'limida paydo bo'ladi"
];

export const ExamDetailPage = () => {
  const { examId } = useParams();
  const startsAt = useMemo(() => new Date(Date.now() + 1000 * 60 * 15), []);

  return (
    <div className="flex flex-col gap-8">
      <ExamDetailHeader
        title={`Imtihon #${examId ?? "???"}`}
        durationMinutes={45}
        attemptsLeft={2}
        reviewPolicy="Natija faqat yakunlangach ko'rinadi"
        startsAt={startsAt}
        status="upcoming"
      />

      <section className="rounded-[28px] border border-stroke/70 bg-surface shadow-elev-sm p-6">
        <h2 className="text-lg font-semibold text-text-primary">Qoidalar</h2>
        <ul className="mt-4 space-y-3 text-sm text-text-secondary">
          {RULES.map((rule) => (
            <li key={rule} className="flex items-start gap-3 leading-relaxed">
              <span className="mt-1 text-brand">•</span>
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-full bg-brand px-7 py-3 text-sm font-semibold text-brand-ink shadow-elev-sm transition duration-swift ease-fluid hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:scale-95"
        >
          Boshlash
        </button>
        <button
          type="button"
          className="rounded-full border border-stroke/70 px-6 py-3 text-sm font-medium text-text-secondary transition duration-swift ease-fluid hover:border-brand/30 hover:text-text-primary active:scale-95"
        >
          Savollar bilan tanishish
        </button>
      </div>
    </div>
  );
};
