import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ExamList } from "@/components/exams/ExamList";
import type { ExamSummary as ExamCardSummary, ExamStatus } from "@/components/exams/ExamCard";
import { PageContainer } from "@/components/layout/Page";
import { apiClient } from "@/lib/apiClient";
import type { ExamSummaryDto } from "@/types/api";
import { cn } from "@/lib/utils";

const FILTERS: Array<{ id: ExamStatus; label: string }> = [
  { id: "upcoming", label: "UPCOMING" },
  { id: "open", label: "OPEN" },
  { id: "closed", label: "CLOSED" }
];

const mapExamToCard = (exam: ExamSummaryDto): ExamCardSummary => ({
  id: exam.id,
  title: exam.title ?? "Imtihon",
  startsAt: exam.startsAt ? new Date(exam.startsAt) : null,
  durationMinutes: exam.durationMin ?? 0,
  status: exam.status
});

export const ExamsPage = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<ExamStatus>("open");
  const [items, setItems] = useState<ExamSummaryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    void (async () => {
      const response = await apiClient.getExams();
      if (!mounted) {
        return;
      }
      if (response.success && response.data) {
        setItems(response.data);
      } else {
        setError(response.error ?? "Imtihonlar ro'yxatini yuklab bo'lmadi.");
      }
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => item.status === activeFilter).map(mapExamToCard);
  }, [activeFilter, items]);

  const hasData = filteredItems.length > 0;

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

      {loading ? (
        <div className="space-y-3">
          {[0, 1].map((key) => (
            <div key={key} className="h-24 animate-pulse rounded-[20px] bg-surface-alt/80" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-[20px] border border-border bg-surface/95 p-4 text-sm text-text-secondary shadow-elev-sm">
          {error}
        </div>
      ) : hasData ? (
        <ExamList items={filteredItems} />
      ) : (
        <div className="rounded-[20px] border border-dashed border-border bg-surface/80 p-4 text-sm text-text-secondary shadow-elev-sm">
          {t("exams.empty", { defaultValue: "Bu toifada hozircha imtihon yo'q." })}
        </div>
      )}
    </PageContainer>
  );
};
