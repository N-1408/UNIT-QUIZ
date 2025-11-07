import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { ExamDetailHeader } from "@/components/exams/ExamDetailHeader";
import { PageContainer } from "@/components/layout/Page";
import { useExamState } from "@/store/useExamState";

const RULES = [
  "Telefonni flight mode'ga o'tkazing.",
  "Savollar orasida orqaga qaytmaymiz.",
  "Topshirgandan keyin natija Results bo'limida paydo bo'ladi."
] as const;

export const ExamDetailPage = () => {
  const { examId } = useParams();
  const numericId = Number(examId);
  const detail = useExamState((state) => state.detail);
  const status = useExamState((state) => state.status);
  const error = useExamState((state) => state.error);
  const fetchExamDetail = useExamState((state) => state.fetchExamDetail);

  useEffect(() => {
    if (!Number.isFinite(numericId)) {
      return;
    }
    void fetchExamDetail(numericId);
  }, [fetchExamDetail, numericId]);

  const headerMeta = useMemo(() => {
    if (!detail || !Number.isFinite(numericId) || detail.id !== numericId) {
      return null;
    }
    return {
      title: detail.title,
      durationMinutes: detail.durationMin ?? 0,
      attemptsLeft: detail.attemptsLimit ?? 0,
      reviewPolicy: detail.reviewPolicy ?? "Natija yakunlangach ochiladi",
      startsAt: detail.startsAt ? new Date(detail.startsAt) : null,
      status: detail.status
    };
  }, [detail, numericId]);

  if (!Number.isFinite(numericId)) {
    return (
      <PageContainer>
        <div className="rounded-[20px] border border-border bg-surface/95 p-4 text-sm text-text-secondary shadow-elev-sm">
          Noto'g'ri imtihon identifikatori.
        </div>
      </PageContainer>
    );
  }

  const isLoading = status === "loading" || !headerMeta;

  return (
    <PageContainer className="gap-5">
      {isLoading ? (
        <div className="space-y-3">
          <div className="h-32 animate-pulse rounded-[24px] bg-surface-alt/80" />
          <div className="h-24 animate-pulse rounded-[20px] bg-surface-alt/60" />
        </div>
      ) : error ? (
        <div className="rounded-[20px] border border-border bg-surface/95 p-4 text-sm text-text-secondary shadow-elev-sm">
          {error}
        </div>
      ) : headerMeta ? (
        <>
          <ExamDetailHeader
            title={headerMeta.title}
            durationMinutes={headerMeta.durationMinutes}
            attemptsLeft={headerMeta.attemptsLeft}
            reviewPolicy={headerMeta.reviewPolicy}
            startsAt={headerMeta.startsAt}
            status={headerMeta.status}
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
              className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-brand-ink shadow-elev-sm transition duration-swift ease-fluid hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:scale-95 disabled:opacity-50"
              disabled={headerMeta.status !== "open"}
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
        </>
      ) : null}
    </PageContainer>
  );
};
