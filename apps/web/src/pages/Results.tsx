import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ResultCard } from "@/components/results/ResultCard";
import { ResultTable } from "@/components/results/ResultTable";
import { PageContainer } from "@/components/layout/Page";
import { apiClient } from "@/lib/apiClient";
import { useAuthStore } from "@/store/useAuth";
import type { AttemptSummaryDto } from "@/types/api";

const deriveStatus = (score: number | null) => {
  if (typeof score !== "number") return "neutral" as const;
  return score >= 70 ? ("passed" as const) : ("failed" as const);
};

export const ResultsPage = () => {
  const { t } = useTranslation();
  const session = useAuthStore((state) => state.session);
  const [attempts, setAttempts] = useState<AttemptSummaryDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.tgId) {
      return;
    }

    let mounted = true;
    setLoading(true);
    setError(null);

    void (async () => {
      const response = await apiClient.getResults(session.tgId);
      if (!mounted) return;
      if (response.success && response.data) {
        setAttempts(response.data);
      } else {
        setError(response.error ?? "Natijalarni yuklashda muammo yuz berdi.");
      }
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [session?.tgId]);

  const latestAttempt = attempts[0];
  const tableRows = useMemo(
    () =>
      attempts.map((attempt) => ({
        id: attempt.id,
        title: attempt.examTitle ?? "No'malum imtihon",
        score: attempt.score ?? 0,
        attempts: 1,
        takenAt: attempt.submittedAt ? new Date(attempt.submittedAt) : new Date()
      })),
    [attempts]
  );

  if (!session) {
    return (
      <PageContainer>
        <div className="rounded-[20px] border border-border bg-surface/95 p-4 text-sm text-text-secondary shadow-elev-sm">
          {t("results.auth_required", { defaultValue: "Natijalarni ko'rish uchun avval tizimga kiring." })}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-text-primary">
          {t("results.title", { defaultValue: "Ko'rib chiqing, bu sizning yutuq tarixi. \uD83C\uDFC6" })}
        </h2>
        <p className="text-sm text-text-secondary">
          {t("results.subtitle", {
            defaultValue: "Har bir natija kichik qadam, ularni qulay jadvalda ko'rib chiqing."
          })}
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="h-20 animate-pulse rounded-[20px] bg-surface-alt/80" />
          <div className="h-48 animate-pulse rounded-[20px] bg-surface-alt/60" />
        </div>
      ) : error ? (
        <div className="rounded-[20px] border border-border bg-surface/95 p-4 text-sm text-text-secondary shadow-elev-sm">
          {error}
        </div>
      ) : attempts.length === 0 ? (
        <div className="rounded-[20px] border border-dashed border-border bg-surface/80 p-4 text-sm text-text-secondary shadow-elev-sm">
          {t("results.empty", { defaultValue: "Hali natijalar yo'q, tez orada birinchi imtihonni o'ting." })}
        </div>
      ) : (
        <>
          {latestAttempt ? (
            <ResultCard
              title={latestAttempt.examTitle ?? "Imtihon"}
              score={latestAttempt.score ?? 0}
              status={deriveStatus(latestAttempt.score)}
              takenAt={latestAttempt.submittedAt ? new Date(latestAttempt.submittedAt) : new Date()}
            />
          ) : null}

          <ResultTable rows={tableRows} />
        </>
      )}
    </PageContainer>
  );
};
