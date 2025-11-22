import { useEffect, useMemo, useState } from "react";

type ExamTimerProps = {
  endTimeISO: string;
  onTimeout: () => void;
};

const formatTime = (remainingMs: number) => {
  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export const ExamTimer = ({ endTimeISO, onTimeout }: ExamTimerProps) => {
  const endTime = useMemo(() => new Date(endTimeISO).getTime(), [endTimeISO]);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const intervalId = window.setInterval(tick, 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (now >= endTime) {
      onTimeout();
    }
  }, [now, endTime, onTimeout]);

  const remainingMs = Math.max(0, endTime - now);
  const minutesLeft = remainingMs / 60000;

  const colorClass =
    minutesLeft <= 1 ? "text-red-600" : minutesLeft <= 5 ? "text-orange-500" : "text-slate-900";

  return (
    <div className={`text-sm font-semibold ${colorClass}`}>
      {formatTime(remainingMs)}
    </div>
  );
};
