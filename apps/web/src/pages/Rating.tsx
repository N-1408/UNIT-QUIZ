import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { AppOutletContext } from "../App";

type RatingItem = {
  id: string;
  name: string;
  groupId: string;
  groupTitle: string;
  score: number;
  updatedAt: string;
};

type Timeframe = "All time" | "This month" | "This week";

const groups = [
  { id: "all", title: "All groups" },
  { id: "g1", title: "CEFR Up A2" },
  { id: "g2", title: "CEFR Up B1" },
  { id: "g3", title: "CEFR Up B2" }
];

const mockData: RatingItem[] = [
  { id: "dilnoza", name: "Dilnoza S.", groupId: "g1", groupTitle: "CEFR Up A2", score: 92, updatedAt: "2025-10-20" },
  { id: "azizbek", name: "Azizbek K.", groupId: "g2", groupTitle: "CEFR Up B1", score: 88, updatedAt: "2025-10-18" },
  { id: "madina", name: "Madina T.", groupId: "g1", groupTitle: "CEFR Up A2", score: 86, updatedAt: "2025-10-05" },
  { id: "laylo", name: "Laylo M.", groupId: "g3", groupTitle: "CEFR Up B2", score: 84, updatedAt: "2025-09-28" }
];

export default function RatingPage() {
  const { user } = useOutletContext<AppOutletContext>();
  const [groupFilter, setGroupFilter] = useState<string>("all");
  const [tf, setTf] = useState<Timeframe>("All time");

  const filtered = useMemo(() => {
    const now = new Date();
    const data = mockData.filter((item) => {
      if (groupFilter !== "all" && item.groupId !== groupFilter) return false;
      if (tf === "This month") {
        const date = new Date(item.updatedAt);
        return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
      }
      if (tf === "This week") {
        const date = new Date(item.updatedAt);
        const diff = Math.abs(now.getTime() - date.getTime());
        return diff <= 7 * 24 * 60 * 60 * 1000;
      }
      return true;
    });

    if (user) {
      const existing = data.find((entry) => entry.id === user.id);
      const fallbackGroup = groups.find((g) => g.id === user.groupId)?.title ?? user.fullName;
      if (!existing) {
        data.push({
          id: user.id,
          name: user.fullName,
          groupId: user.groupId,
          groupTitle: fallbackGroup,
          score: 82,
          updatedAt: new Date().toISOString().slice(0, 10)
        });
      }
    }

    data.sort((a, b) => b.score - a.score);

    return data;
  }, [groupFilter, tf, user]);

  return (
    <section className="flex flex-col gap-4 pb-28">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold" style={{ color: "var(--fg)" }}>
          Ranking
        </h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Only the first attempt is counted towards the leaderboard.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <select
          className="rounded-xl border border-[var(--divider)] bg-[var(--card)] px-3 py-2 text-sm"
          value={groupFilter}
          onChange={(event) => setGroupFilter(event.target.value)}
        >
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.title}
            </option>
          ))}
        </select>
        <div className="ml-auto flex items-center gap-2">
          {["All time", "This month", "This week"].map((option) => (
            <button
              key={option}
              onClick={() => setTf(option as Timeframe)}
              className={`rounded-xl border px-3 py-2 text-sm ${
                tf === option ? 'border-[var(--brand-yellow)] text-[var(--brand-yellow)]' : 'border-[var(--divider)]'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {filtered.map((item, index) => {
          const isCurrent = item.id === user?.id;
          return (
            <div
              key={item.id}
              className={`card flex items-center justify-between px-4 py-3 ${isCurrent ? 'ring-2 ring-[var(--brand-yellow)]' : ''}`}
            >
              <div>
                <p className="font-medium" style={{ color: "var(--fg)" }}>
                  {index + 1}. {item.name}
                </p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  {item.groupTitle}
                </p>
              </div>
              <span className="badge font-semibold text-[var(--brand-yellow)]">{item.score}</span>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="card p-4 text-sm" style={{ color: "var(--muted)" }}>
            No results for the selected filters.
          </div>
        )}
      </div>
    </section>
  );
}

