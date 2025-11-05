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
  <div className="overflow-hidden rounded-3xl ring-1 ring-stroke">
    <table className="min-w-full divide-y divide-stroke/60 text-left text-sm">
      <thead className="bg-surface-2/80">
        <tr>
          <th className="px-4 py-3 font-medium text-muted">Imtihon</th>
          <th className="px-4 py-3 font-medium text-muted">Ball</th>
          <th className="px-4 py-3 font-medium text-muted">Urinishlar</th>
          <th className="px-4 py-3 font-medium text-muted">Vaqti</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-stroke/60 bg-card/80">
        {rows.map((row) => (
          <tr key={row.id} className="hover:bg-surface-2/60">
            <td className="px-4 py-3 font-medium text-slate-100">{row.title}</td>
            <td className="px-4 py-3 text-slate-50">{row.score}%</td>
            <td className="px-4 py-3 text-muted">{row.attempts}</td>
            <td className="px-4 py-3 text-muted">{row.takenAt.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
