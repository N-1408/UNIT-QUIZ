import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { AppOutletContext } from "../App";
import { haptic } from "../lib/tg";
import { useI18n } from "../i18n";

type RatingItem = {
  id: string;
  name: string;
  groupId: string;
  groupTitle: string;
  score: number;
  updatedAt: string;
};

type Timeframe = "all" | "month" | "week";

const groups = [
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

const TIMEFRAME_OPTIONS: Array<{ value: Timeframe; labelKey: string }> = [
  { value: "all", labelKey: "timeframeAll" },
  { value: "month", labelKey: "timeframeMonth" },
  { value: "week", labelKey: "timeframeWeek" }
];

export default function RatingPage() {
  const { user } = useOutletContext<AppOutletContext>();
  const { t } = useI18n();
  const [groupId, setGroupId] = useState<string>("all");
  const [tf, setTf] = useState<Timeframe>("all");

  const filtered = useMemo(() => {
    const now = new Date();
    const data = mockData.filter((item) => {
      if (groupId !== "all" && item.groupId !== groupId) return false;
      if (tf === "month") {
        const date = new Date(item.updatedAt);
        return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
      }
      if (tf === "week") {
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

    return data.sort((a, b) => b.score - a.score);
  }, [groupId, tf, user]);

  return (
    <div className="mx-auto max-w-md p-4 pb-24">
      <header className="text-center">
        <h1 className="section-title">{t("ranking")}</h1>
        <p className="section-sub mt-1">{t("onlyFirstCounts")}</p>
      </header>

      <div className="mt-6 flex flex-col items-center gap-3">
        <select
          className="tap rounded-xl border border-[var(--divider)] bg-[var(--card)] px-4 py-3 text-sm"
          value={groupId}
          onChange={(event) => {
            haptic.tap();
            setGroupId(event.target.value);
          }}
        >
          <option value="all">{t("groupFilter")}</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.title}
            </option>
          ))}
        </select>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {TIMEFRAME_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                haptic.tap();
                setTf(option.value);
              }}
              className={`pill tap ${tf === option.value ? "pill-active" : ""}`}
            >
              {t(option.labelKey)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {filtered.map((item, index) => {
          const isCurrent = item.id === user?.id;
          return (
            <div
              key={item.id}
              className={`card flex items-center justify-between gap-3${isCurrent ? " card-current-user" : ""}`}
            >
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--fg)" }}>
                  #{index + 1} {item.name}
                </p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  {item.groupTitle}
                </p>
              </div>
              <span className="badge">{item.score}</span>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="card text-sm" style={{ color: "var(--muted)" }}>
            {t("noResults")}
          </div>
        )}
      </div>
    </div>
  );
}
