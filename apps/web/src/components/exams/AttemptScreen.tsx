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
      "w-full rounded-2xl border border-stroke bg-surface-2 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-brand hover:text-slate-50",
      active && "border-brand bg-brand/20 text-brand",
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
      <div className="rounded-3xl border border-dashed border-stroke/70 p-6 text-sm text-muted">
        Savollar hali tayyorlanmoqda. Birpasdan so'ng qayta kirib ko'ring.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Savol #{currentIndex + 1}</p>
          <h2 className="text-lg font-semibold text-slate-100">{question.text}</h2>
        </div>
        <span className="rounded-full bg-surface-2 px-3 py-1 text-xs text-muted">
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
          className="rounded-2xl bg-surface-2 px-4 py-2 text-sm font-medium text-muted transition enabled:hover:text-slate-100 disabled:opacity-50"
        >
          Oldingi
        </button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSubmit}
            className="rounded-2xl bg-brand px-5 py-2 text-sm font-semibold text-brand-ink shadow-md transition hover:bg-brand/90"
          >
            Topshiramizmi?
          </button>
          <button
            type="button"
            disabled={currentIndex >= questions.length - 1}
            onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
            className="rounded-2xl bg-surface-2 px-4 py-2 text-sm font-medium text-muted transition enabled:hover:text-slate-100 disabled:opacity-50"
          >
            Keyingi
          </button>
        </div>
      </footer>
    </div>
  );
};
