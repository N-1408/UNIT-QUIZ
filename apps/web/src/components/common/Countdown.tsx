import { useEffect, useMemo, useState } from "react";

type CountdownProps = {
  target: Date;
  onComplete?: () => void;
};

const pad = (value: number) => value.toString().padStart(2, "0");

export const Countdown = ({ target, onComplete }: CountdownProps) => {
  const targetTime = useMemo(() => target.getTime(), [target]);
  const [remaining, setRemaining] = useState(() => Math.max(targetTime - Date.now(), 0));

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(targetTime - Date.now(), 0);
      setRemaining(diff);
      if (diff === 0) {
        onComplete?.();
      }
    };

    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [onComplete, targetTime]);

  const seconds = Math.floor(remaining / 1000) % 60;
  const minutes = Math.floor(remaining / (1000 * 60)) % 60;
  const hours = Math.floor(remaining / (1000 * 60 * 60));

  return (
    <span className="tabular-nums text-sm font-semibold text-brand">
      {hours > 0 ? `${pad(hours)}:` : ""}
      {pad(minutes)}:{pad(seconds)}
    </span>
  );
};
