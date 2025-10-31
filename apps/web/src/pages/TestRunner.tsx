import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Clock3 } from "lucide-react";
import { haptic } from "../lib/tg";

type OptionKey = "A" | "B" | "C" | "D";
type Option = { key: OptionKey; text: string };
type Question = { id: string; text: string; options: Option[]; correct?: OptionKey };

const DURATION = 600;

export default function TestRunner() {
  const { id } = useParams();
  const [secondsLeft, setSecondsLeft] = useState<number>(DURATION);
  const [answers, setAnswers] = useState<Record<string, OptionKey | undefined>>({});
  const timerRef = useRef<number | null>(null);

  const questions: Question[] = useMemo(
    () => [
      {
        id: "q1",
        text: 'Which word completes the sentence: "I ____ to school yesterday."',
        options: [
          { key: "A", text: "go" },
          { key: "B", text: "went" },
          { key: "C", text: "going" },
          { key: "D", text: "gone" }
        ],
        correct: "B"
      },
      {
        id: "q2",
        text: 'Choose the synonym of "rapid".',
        options: [
          { key: "A", text: "slow" },
          { key: "B", text: "fast" },
          { key: "C", text: "late" },
          { key: "D", text: "weak" }
        ],
        correct: "B"
      }
    ],
    []
  );

  useEffect(() => {
    if (timerRef.current !== null) return;
    timerRef.current = window.setInterval(() => {
      setSecondsLeft((seconds) => (seconds > 0 ? seconds - 1 : 0));
    }, 1000);
    return () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
    };
  }, []);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  function pick(questionId: string, key: OptionKey) {
    haptic.tap();
    setAnswers((prev) => ({ ...prev, [questionId]: key }));
  }

  function submit() {
    haptic.success();
    let score = 0;
    questions.forEach((question) => {
      if (answers[question.id] && question.correct && answers[question.id] === question.correct) {
        score++;
      }
    });
    alert(`Submitted (mock). Score: ${score}/${questions.length}`);
  }

  return (
    <div className="mx-auto max-w-md px-4 pb-32 pt-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm" style={{ color: "var(--muted)" }}>
          Test ID: {id ?? "demo"}
        </div>
        <span className="badge badge-time">
          <Clock3 size={14} /> {mm}:{ss}
        </span>
      </div>

      <div className="space-y-4">
        {questions.map((question, index) => (
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
                    onClick={() => pick(question.id, option.key)}
                    className={`tap flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-3 text-left transition ${
                      active
                        ? "border-[#222] bg-[#000] text-[var(--brand-yellow)]"
                        : "border-[var(--divider)] bg-[var(--card)] hover:bg-[var(--elev)]"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold ${
                        active
                          ? "border-[var(--brand-yellow)] bg-[rgba(255,207,0,0.14)] text-[var(--brand-yellow)]"
                          : "border-[var(--divider)]"
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
        className="fixed inset-x-0 bottom-0 z-10 border-t"
        style={{ background: 'var(--bg)', borderColor: 'var(--divider)' }}
      >
        <div className="mx-auto max-w-md p-3">
          <button
            onClick={() => {
              haptic.tap();
              submit();
            }}
            className="btn btn-primary tap w-full"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
