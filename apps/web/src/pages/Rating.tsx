import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { haptic } from "../lib/tg";
import { useI18n } from "../i18n";
import type { AuthOutletContext } from "../App";

const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

type RatingItem = {
  id: string;
  name: string;
  groupTitle: string;
  score: number;
};

type RatingResponse = RatingItem[];

type Timeframe = 'all' | 'month' | 'week';

const TIMEFRAME_OPTIONS: Array<{ value: Timeframe; labelKey: string }> = [
  { value: 'all', labelKey: 'timeframeAll' },
  { value: 'month', labelKey: 'timeframeMonth' },
  { value: 'week', labelKey: 'timeframeWeek' }
];

export default function RatingPage() {
  const { user } = useOutletContext<AuthOutletContext>();
  const { t } = useI18n();
  const [timeframe, setTimeframe] = useState<Timeframe>('all');

  const { data, isLoading, isError, refetch } = useQuery<RatingResponse>({
    queryKey: ['rating', timeframe],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/rating`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('failed_to_fetch');
      }
      return response.json();
    }
  });

  const rows = data ?? [];

  return (
    <div className="mx-auto max-w-md p-4 pb-24">
      <header className="text-center">
        <h1 className="section-title">{t('ranking')}</h1>
        <p className="section-sub mt-1">{t('onlyFirstCounts')}</p>
      </header>

      <div className="mt-6 flex flex-col items-center gap-3">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {TIMEFRAME_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                haptic.tap();
                setTimeframe(option.value);
              }}
              className={`pill tap ${timeframe === option.value ? 'pill-active' : ''}`}
            >
              {t(option.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="mt-6 rounded-2xl border border-[var(--divider)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--muted)]">
          Loading ranking…
        </div>
      )}

      {isError && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
          Could not load ranking.{' '}
          <button type="button" className="underline" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      )}

      <div className="mt-6 space-y-3">
        {rows.map((item, index) => {
          const isCurrent = item.id === user.tg_id;
          return (
            <div
              key={item.id}
              className={`card flex items-center justify-between gap-3${isCurrent ? ' card-current-user' : ''}`}
            >
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--fg)' }}>
                  #{index + 1} {item.name}
                </p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>
                  {item.groupTitle}
                </p>
              </div>
              <span className="badge">{item.score}</span>
            </div>
          );
        })}
        {!isLoading && rows.length === 0 && !isError ? (
          <div className="card text-sm" style={{ color: 'var(--muted)' }}>
            {t('noResults')}
          </div>
        ) : null}
      </div>
    </div>
  );
}
