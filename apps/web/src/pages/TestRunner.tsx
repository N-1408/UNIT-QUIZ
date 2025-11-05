import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Clock3 } from "lucide-react";
import { haptic } from "../lib/tg";
import { buildApiUrl } from "../lib/api";

type QuestionOption = {
  key: string;
  text: string;
};

type Question = {
  id: string;
  text: string;
  options: QuestionOption[];
};

type TestDetail = {
  id: string;
  title: string;
  unit: string;
  durationSec: number;
  questions: Question[];
};

export default function TestRunner() {
  const { id } = useParams();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const { data, isLoading, isError, refetch } = useQuery<TestDetail>({
    queryKey: ["test", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const response = await fetch(buildApiUrl(`/api/tests/${id}`));
      if (!response.ok) {
        throw new Error("failed_to_fetch");
      }
      return response.json() as Promise<TestDetail>;
    }
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-md px-4 pb-32 pt-6">
        <div className="rounded-2xl border border-[var(--divider)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--muted)]">
          Test ma'lumotlari yuklanmoqda...
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-md px-4 pb-32 pt-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
          Testni yuklashda xatolik.{" "}
          <button type="button" className="underline" onClick={() => refetch()}>
            Qayta urinish
          </button>
        </div>
      </div>
    );
  }

  const durationMinutes = Math.round(data.durationSec / 60);

  const handlePick = (questionId: string, optionKey: string) => {
    haptic.tap();
    setAnswers((prev) => ({ ...prev, [questionId]: optionKey }));
  };

  const handleSubmit = () => {
    haptic.success();
    alert("Javoblar saqlandi (demo).");
  };

  return (
    <div className="mx-auto max-w-md px-4 pb-32 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-[var(--muted)]">{data.unit}</p>
          <h1 className="text-lg font-semibold" style={{ color: "var(--fg)" }}>
            {data.title}
          </h1>
        </div>
        <span className="badge badge-time">
          <Clock3 size={14} /> {durationMinutes} min
        </span>
      </div>

      <div className="mt-5 space-y-4">
        {data.questions.map((question, index) => (
          <div key={question.id} className="card space-y-3">
            <div className="font-medium" style={{ color: "var(--fg)" }}>
              {index + 1}. {question.text}
            </div>
            <div className="space-y-2">
              {question.options.map((option) => {
                const active = answers[question.id] === option.key;
                return (
                  <button
                    key={option.key}
                    onClick={() => handlePick(question.id, option.key)}
                    className={`tap flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-3 text-left transition ${
                      active
                        ? "border-transparent bg-[linear-gradient(135deg,_var(--brand-primary),_var(--brand-secondary))] text-white shadow-[0_12px_28px_rgba(255,95,0,0.2)]"
                        : "border-[var(--divider)] bg-[var(--card)] hover:bg-[color-mix(in_oklab,_var(--fg)_6%,_transparent)]"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold ${
                        active
                          ? "border-white bg-white/20 text-white"
                          : "border-[var(--divider)] text-[var(--muted)]"
                      }`}
                    >
                      {option.key}
                    </span>
                    <span className="flex-1">{option.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="h-24" />
      <div
        className="fixed inset-x-0 bottom-0 z-10 border-t bg-[color-mix(in_oklab,_var(--bg)_80%,_white)]"
        style={{ borderColor: "var(--divider)" }}
      >
        <div className="mx-auto max-w-md p-3">
          <button onClick={handleSubmit} className="btn btn-primary tap w-full">
            Javoblarni jo'natish
          </button>
        </div>
      </div>
    </div>
  );
}
