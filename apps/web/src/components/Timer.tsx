import { useEffect, useMemo, useState } from 'react';

export interface TimerProps {
  durationSec: number;
  isActive?: boolean;
  onComplete?: () => void;
}

function formatSeconds(value: number) {
  const minutes = Math.floor(value / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor(value % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function Timer({ durationSec, isActive = true, onComplete }: TimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(durationSec);
  const percentage = useMemo(
    () => Math.max(0, Math.round((secondsLeft / durationSec) * 100)),
    [durationSec, secondsLeft]
  );

  useEffect(() => {
    if (!isActive || secondsLeft <= 0) {
      if (secondsLeft <= 0) {
        onComplete?.();
      }
      return;
    }

    const interval = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [isActive, onComplete, secondsLeft]);

  return (
    <div className="mx-auto flex w-full max-w-xs flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="relative flex h-36 w-36 items-center justify-center">
        <svg className="h-full w-full -rotate-90 text-slate-200" viewBox="0 0 100 100">
          <circle
            className="text-slate-200"
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />
          <circle
            className="text-primary transition-all"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
            strokeDasharray={`${Math.min(282.6, (percentage / 100) * 282.6)} 282.6`}
          />
        </svg>
        <span className="absolute text-3xl font-semibold text-slate-900">{formatSeconds(secondsLeft)}</span>
      </div>
      <p className="text-sm text-slate-500">Vaqt tugaganda javoblar avtomatik jo‘natiladi (hozircha demo).</p>
    </div>
  );
}

export default Timer;
