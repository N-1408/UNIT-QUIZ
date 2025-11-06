import { ExamCard, type ExamSummary } from "@/components/exams/ExamCard";
import { EmptyState } from "@/components/common/EmptyState";

type ExamListProps = {
  items: ExamSummary[];
  emptyMessage?: string;
};

export const ExamList = ({
  items,
  emptyMessage = "Hali rejada imtihon yo'q, lekin siz baribir zo'rsiz \uD83D\uDE0E"
}: ExamListProps) => {
  if (!items.length) {
    return (
      <EmptyState
        title={emptyMessage}
        description="Qahva tayyorlab qo'ying, tez orada yangi sinovlar keladi."
        icon="\uD83D\uDCEB"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {items.map((exam) => (
        <ExamCard key={exam.id} exam={exam} />
      ))}
    </div>
  );
};
