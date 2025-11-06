import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ExamList } from "@/components/exams/ExamList";
import type { ExamSummary } from "@/components/exams/ExamCard";
import { PageContainer } from "@/components/layout/Page";
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
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]["id"]>("open");

  return (
    <PageContainer className="gap-5">
      <div className="flex flex-col gap-2">
        <h2 className="text-base font-semibold text-text-primary">
          {t("exams.title", { defaultValue: "Kayfiyatga qarab tanlang, hammasi tayyor." })}
        </h2>
        <p className="text-sm text-text-secondary">
          {t("exams.subtitle", { defaultValue: "Qaysi toifa sizni chaqiryapti? Filtrlab ko'ring." })}
        </p>
      </div>

      <div className="inline-flex w-full items-center justify-between rounded-full border border-border bg-surface/95 p-1 shadow-elev-sm">
        {FILTERS.map((filter) => {
          const isActive = filter.id === activeFilter;
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              className={cn(
                "flex-1 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-wide transition duration-swift ease-fluid",
                isActive
                  ? "bg-brand text-brand-ink shadow-elev-sm"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <ExamList items={MOCK_DATA[activeFilter]} />
    </PageContainer>
  );
};
