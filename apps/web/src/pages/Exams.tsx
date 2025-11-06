import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ExamList } from "@/components/exams/ExamList";
import type { ExamSummary } from "@/components/exams/ExamCard";
import { cn } from "@/lib/utils";

const MOCK_DATA: Record<"upcoming" | "open" | "closed", ExamSummary[]> = {
  upcoming: [
    {
      id: 3,
      title: "Speaking Jam Session",
      startsAt: new Date(Date.now() + 1000 * 60 * 120),
      durationMinutes: 25,
      status: "upcoming"
    }
  ],
  open: [
    {
      id: 4,
      title: "Grammar Clinic",
      startsAt: null,
      durationMinutes: 35,
      status: "open"
    }
  ],
  closed: []
};

const FILTERS = [
  { id: "upcoming", label: "UPCOMING" },
  { id: "open", label: "OPEN" },
  { id: "closed", label: "CLOSED" }
] as const;

export const ExamsPage = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] =
    useState<(typeof FILTERS)[number]["id"]>("open");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-text-primary">
          {t("exams.title", { defaultValue: "Imtihonlar ro‘yxati" })}
        </h2>
        <p className="text-sm text-text-secondary">
          {t("exams.subtitle", {
            defaultValue: "Kayfiyatga mosini tanlang, start uchun hammasi tayyor."
          })}
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((filter) => {
          const isActive = filter.id === activeFilter;
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              className={cn(
                "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition duration-swift ease-fluid",
                isActive
                  ? "border-brand/50 bg-brand text-brand-ink shadow-elev-sm"
                  : "border-stroke/60 bg-surface-alt text-text-secondary hover:border-brand/30 hover:text-text-primary"
              )}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <ExamList items={MOCK_DATA[activeFilter]} />
    </div>
  );
};
