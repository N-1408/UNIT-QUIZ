import { useMemo } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { useExamState } from "@/store/useExamState";

type AttemptScreenProps = {
  questions: Array<{
    id: number;
    text: string;
    options: Array<{ id: number; text: string }>;
  }>;
  onSubmit?: () => void;
};

type OptionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
};

const OptionButton = ({ active, className, children, ...rest }: OptionButtonProps) => (
  <button
    type="button"
    className={cn(
      "w-full rounded-[20px] border border-stroke/60 bg-surface px-4 py-3 text-left text-sm text-text-primary shadow-elev-sm transition duration-swift ease-fluid hover:border-brand/40 hover:bg-brand-light/40 hover:text-brand",
      active && "border-brand bg-brand-light text-brand",
      className
    )}
    {...rest}
  >
    {children}
  </button>
);

export const AttemptScreen = ({ questions, onSubmit }: AttemptScreenProps) => {
  const { currentIndex, setCurrentIndex } = useExamState();

  const question = useMemo(() => questions[currentIndex], [questions, currentIndex]);

  if (!question) {
    return (
      <div className="rounded-[28px] border border-dashed border-stroke/70 bg-surface p-6 text-sm text-text-secondary">
        Savollar hali tayyorlanmoqda. Birpasdan so'ng qayta kirib ko'ring.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            Savol #{currentIndex + 1}
          </p>
          <h2 className="text-lg font-semibold leading-snug text-text-primary">{question.text}</h2>
        </div>
        <span className="rounded-full border border-stroke/60 bg-surface-alt px-3 py-1 text-xs text-text-secondary">
          {currentIndex + 1}/{questions.length}
        </span>
      </header>

      <div className="flex flex-col gap-3">
        {question.options.map((option) => (
          <OptionButton key={option.id}>{option.text}</OptionButton>
        ))}
      </div>

      <footer className="mt-4 flex items-center justify-between gap-3">
        <button
          type="button"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          className="rounded-full border border-stroke/60 bg-surface-alt px-4 py-2 text-sm font-medium text-text-secondary transition duration-swift ease-fluid enabled:hover:border-brand/30 enabled:hover:text-text-primary disabled:opacity-50"
        >
          Oldingi
        </button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSubmit}
            className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-brand-ink shadow-elev-sm transition duration-swift ease-fluid hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:scale-95"
          >
            Topshiramizmi?
          </button>
          <button
            type="button"
            disabled={currentIndex >= questions.length - 1}
            onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
            className="rounded-full border border-stroke/60 bg-surface-alt px-4 py-2 text-sm font-medium text-text-secondary transition duration-swift ease-fluid enabled:hover:border-brand/30 enabled:hover:text-text-primary disabled:opacity-50"
          >
            Keyingi
          </button>
        </div>
      </footer>
    </div>
  );
};
