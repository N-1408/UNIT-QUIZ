import { useTranslation } from "react-i18next";
import { ResultCard } from "@/components/results/ResultCard";
import { ResultTable } from "@/components/results/ResultTable";
import { PageContainer } from "@/components/layout/Page";

const MOCK_ROWS = [
  { id: 1, title: "Listening Sprint", score: 87, attempts: 1, takenAt: new Date() },
  { id: 2, title: "Reading Marathon", score: 74, attempts: 2, takenAt: new Date(Date.now() - 86400000) }
];

export const ResultsPage = () => {
  const { t } = useTranslation();

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

      <div className="flex flex-col gap-3">
        <ResultCard title="Listening Sprint" score={87} status="passed" takenAt={new Date()} />
        <ResultCard title="Reading Marathon" score={54} status="failed" takenAt={new Date()} />
      </div>

      <ResultTable rows={MOCK_ROWS} />
    </PageContainer>
  );
};
