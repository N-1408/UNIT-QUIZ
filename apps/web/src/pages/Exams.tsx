import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ExamList } from "@/components/exams/ExamList";
import type { ExamSummary as ExamCardSummary, ExamStatus } from "@/components/exams/ExamCard";
import { PageContainer } from "@/components/layout/Page";
import { apiClient } from "@/lib/apiClient";
import type { ExamSummaryDto } from "@/types/api";
import { cn } from "@/lib/utils";
import { useRoleStore } from "@/store/roleStore";
import { Fab } from "@mui/material";
import { Add } from "@mui/icons-material";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { EmptyExams } from "@/components/EmptyState";
import { BulkImportModal } from "@/components/BulkImportModal";

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
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<ExamStatus>("open");
  const [items, setItems] = useState<ExamSummaryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const role = useRoleStore((state) => state.role);
  const [importModalOpen, setImportModalOpen] = useState(false);

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

  const renderContent = () => {
    if (loading) {
      return <LoadingSkeleton variant="list" />;
    }

    if (error) {
      return (
        <div className="rounded-[20px] border border-border bg-surface/95 p-4 text-sm text-text-secondary shadow-elev-sm">
          {error}
        </div>
      );
    }

    if (!hasData) {
      return <EmptyExams onAction={() => navigate("/results")} />;
    }

    return <ExamList items={filteredItems} />;
  };

  return (
    <>
      <PageContainer className="gap-5 pb-28">
        <div className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-text-primary">
            {t("exams.title", { defaultValue: "Kayfiyatga qarab tanlang, hammasi tayyor." })}
          </h2>
          <p className="text-sm text-text-secondary">
            {t("exams.subtitle", { defaultValue: "Qaysi toifa sizni chaqiryapti? Filtrlab ko'ring." })}
          </p>
        </div>

        <div className="sticky top-4 z-30 mx-auto w-full max-w-md">
          <div className="inline-flex w-full items-center justify-between rounded-full border border-white/20 bg-white/80 p-1.5 shadow-lg shadow-brand/5 backdrop-blur-xl transition-all hover:bg-white/90 dark:bg-black/60 dark:hover:bg-black/70">
            {FILTERS.map((filter) => {
              const isActive = filter.id === activeFilter;
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  className={cn(
                    "relative flex-1 rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 ease-out",
                    isActive
                      ? "text-white shadow-md"
                      : "text-text-secondary hover:bg-black/5 hover:text-text-primary dark:hover:bg-white/10"
                  )}
                >
                  {isActive && (
                    <span className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-brand to-brand-gradient1 transition-transform duration-300" />
                  )}
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {renderContent()}
      </PageContainer>
      {role !== "student" ? (
        <>
          <Fab
            color="primary"
            sx={{
              position: "fixed",
              bottom: 80,
              right: 16,
              bgcolor: "#FF5F00",
              "&:hover": { bgcolor: "#E05500" }
            }}
            onClick={() => setImportModalOpen(true)}
          >
            <Add />
          </Fab>
          <BulkImportModal
            open={importModalOpen}
            onClose={() => setImportModalOpen(false)}
            onImport={handleImport}
          />
        </>
      ) : null}
    </>
  );
};
const handleImport = (questions: unknown[]) => {
  localStorage.setItem("importedQuestions", JSON.stringify(questions));
  alert(`${questions.length} ta savol import qilindi!`);
};
