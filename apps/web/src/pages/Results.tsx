import { ResultCard } from "@/components/results/ResultCard";
import { ResultTable } from "@/components/results/ResultTable";

const MOCK_ROWS = [
  { id: 1, title: "Listening Sprint", score: 87, attempts: 1, takenAt: new Date() },
  { id: 2, title: "Reading Marathon", score: 74, attempts: 2, takenAt: new Date(Date.now() - 86400000) }
];

export const ResultsPage = () => (
  <div className="flex flex-col gap-6">
    <div className="grid gap-4 md:grid-cols-2">
      <ResultCard title="Listening Sprint" score={87} status="passed" takenAt={new Date()} />
      <ResultCard title="Reading Marathon" score={54} status="failed" takenAt={new Date()} />
    </div>
    <ResultTable rows={MOCK_ROWS} />
  </div>
);
