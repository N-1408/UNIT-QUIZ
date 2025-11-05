import { ExamCard, type ExamSummary } from "@/components/exams/ExamCard";
import { EmptyState } from "@/components/common/EmptyState";

type ExamListProps = {
  items: ExamSummary[];
  emptyMessage?: string;
};

export const ExamList = ({
  items,
  emptyMessage = "Hali rejada imtihon yo'q. Ammo bu vaqtni dam olishga sarflab qo'ying ??"
}: ExamListProps) => {
  if (!items.length) {
    return (
      <EmptyState
        title={emptyMessage}
        description="Qahva tayyorlab, o'zingizni rag'batlantirib turing. Yangi testlar yaqin!"
        icon="???"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((exam) => (
        <ExamCard key={exam.id} exam={exam} />
      ))}
    </div>
  );
};
