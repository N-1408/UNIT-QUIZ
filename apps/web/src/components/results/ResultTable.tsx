import { cn } from "@/lib/utils";

type ResultRow = {
  id: number;
  title: string;
  score: number;
  attempts: number;
  takenAt: Date;
};

type ResultTableProps = {
  rows: ResultRow[];
};

export const ResultTable = ({ rows }: ResultTableProps) => (
  <div className="overflow-hidden rounded-[24px] border border-border bg-surface shadow-elev-sm">
    <table className="min-w-full text-left text-sm">
      <thead className="bg-surface-alt/80 text-text-secondary">
        <tr>
          <th className="px-5 py-3 font-medium">Imtihon</th>
          <th className="px-5 py-3 font-medium">Ball</th>
          <th className="px-5 py-3 font-medium">Urinishlar</th>
          <th className="px-5 py-3 font-medium">Vaqti</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr
            key={row.id}
            className={cn(
              "transition duration-swift ease-fluid hover:bg-brand-light/30",
              index % 2 === 0 ? "bg-surface" : "bg-surface-alt/60"
            )}
          >
            <td className="px-5 py-3 font-medium text-text-primary">{row.title}</td>
            <td className="px-5 py-3 text-text-primary">{row.score}%</td>
            <td className="px-5 py-3 text-text-secondary">{row.attempts}</td>
            <td className="px-5 py-3 text-text-secondary">{row.takenAt.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
