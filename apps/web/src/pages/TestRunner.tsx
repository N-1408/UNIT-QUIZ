import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Clock3 } from "lucide-react";
import { haptic } from "../lib/tg";

const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

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
    queryKey: ['test', id],
    enabled: Boolean(id),
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/tests/${id}`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('failed_to_fetch');
      }
      return response.json();
    }
  });

  if (isLoading) {
    return <div className="p-4 text-sm text-[var(--muted)]">Loading test…</div>;
  }

  if (isError || !data) {
    return (
      <div className="p-4 text-sm text-red-600">
        Failed to load test.{' '}
        <button type="button" className="underline" onClick={() => refetch()}>
          Retry
        </button>
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
    alert('Responses saved (demo).');
  };

  return (
    <div className="mx-auto max-w-md px-4 pb-32 pt-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm" style={{ color: 'var(--muted)' }}>
          {data.title}
        </div>
        <span className="badge badge-time">
          <Clock3 size={14} /> {durationMinutes} min
        </span>
      </div>

      <div className="space-y-4">
        {data.questions.map((question, index) => (
          <div key={question.id} className="card space-y-3">
            <div className="font-medium" style={{ color: 'var(--fg)' }}>
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
                        ? 'border-[#222] bg-[#000] text-[var(--brand-yellow)]'
                        : 'border-[var(--divider)] bg-[var(--card)] hover:bg-[var(--elev)]'
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold ${
                        active
                          ? 'border-[var(--brand-yellow)] bg-[rgba(255,207,0,0.14)] text-[var(--brand-yellow)]'
                          : 'border-[var(--divider)]'
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
      <div className="fixed inset-x-0 bottom-0 z-10 border-t" style={{ background: 'var(--bg)', borderColor: 'var(--divider)' }}>
        <div className="mx-auto max-w-md p-3">
          <button onClick={handleSubmit} className="btn btn-primary tap w-full">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
