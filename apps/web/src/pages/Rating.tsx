import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProtectedRoute from "../components/ProtectedRoute";
import UserHeader from "../components/UserHeader";
import { haptic } from "../lib/tg";
import { useI18n } from "../i18n";

const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

type RatingItem = {
  id: string;
  name: string;
  groupTitle: string;
  score: number;
};

type RatingResponse = RatingItem[];

type Timeframe = "all" | "month" | "week";

type TimeframeOption = {
  value: Timeframe;
  labelKey: string;
};

const TIMEFRAME_OPTIONS: TimeframeOption[] = [
  { value: "all", labelKey: "timeframeAll" },
  { value: "month", labelKey: "timeframeMonth" },
  { value: "week", labelKey: "timeframeWeek" },
];

type MeResponse = {
  tg_id: string;
};

export default function RatingPage() {
  const { t } = useI18n();
  const [timeframe, setTimeframe] = useState<Timeframe>("all");

  const { data: me } = useQuery<MeResponse | null>({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await fetch("https://unit-quiz.onrender.com/api/auth/me", {
        credentials: "include",
      });
      if (!res.ok) return null;
      return res.json();
    },
  });

  const { data, isLoading, isError, refetch } = useQuery<RatingResponse>({
    queryKey: ["rating", timeframe],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/rating`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("failed_to_fetch");
      }
      return response.json();
    },
  });

  const rows = data ?? [];

  return (
    <ProtectedRoute>
      <div className="mx-auto flex max-w-md flex-col gap-4 p-4 pb-24">
        <UserHeader />

        <header className="text-center">
          <h1 className="section-title">{t("ranking")}</h1>
          <div className="section-accent mx-auto mt-2" />
          <p className="mt-3 text-sm text-[var(--muted)]">{t("onlyFirstCounts")}</p>
        </header>

        <div className="flex justify-center">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {TIMEFRAME_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  haptic.tap();
                  setTimeframe(option.value);
                }}
                className={`pill tap ${timeframe === option.value ? "pill-active" : ""}`}
              >
                {t(option.labelKey)}
              </button>
            ))}
          </div>
        </div>

        {isLoading && (
          <div className="rounded-2xl border border-[var(--divider)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--muted)]">
            Loading ranking...
          </div>
        )}

        {isError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
            Could not load ranking.{" "}
            <button type="button" className="underline" onClick={() => refetch()}>
              Retry
            </button>
          </div>
        )}

        <div className="space-y-3">
          {rows.map((item, index) => {
            const isCurrent = me?.tg_id === item.id;
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
          {!isLoading && rows.length === 0 && !isError ? (
            <div className="card text-sm" style={{ color: "var(--muted)" }}>
              {t("noResults")}
            </div>
          ) : null}
        </div>
      </div>
    </ProtectedRoute>
  );
}
