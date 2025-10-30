import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

type Option = { key: "A" | "B" | "C" | "D"; text: string };
type Question = { id: string; text: string; options: Option[]; correct?: "A" | "B" | "C" | "D" };

const DURATION = 600; // 10 minutes

export default function TestRunner() {
  const { id } = useParams();
  const [secondsLeft, setSecondsLeft] = useState<number>(DURATION);
  const [answers, setAnswers] = useState<Record<string, Option["key"] | undefined>>({});
  const timerRef = useRef<number | null>(null);

  const questions: Question[] = useMemo(
    () => [
      {
        id: "q1",
        text: "Which word completes the sentence: “I ____ to school yesterday.”",
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
        text: "Choose the synonym of “rapid”.",
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
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
    };
  }, []);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  function pick(qid: string, key: Option["key"]) {
    setAnswers((prev) => ({ ...prev, [qid]: key }));
  }

  function submit() {
    let score = 0;
    questions.forEach((q) => {
      if (answers[q.id] && q.correct && answers[q.id] === q.correct) score++;
    });
    window.alert(`Yuborildi (mock). Natija: ${score}/${questions.length}`);
  }

  return (
    <div className="mx-auto max-w-md p-4 pb-24">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-white/70">Test ID: {id}</div>
        <div className="rounded-full bg-white/10 px-3 py-1">
          {mm}:{ss}
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((q, idx) => (
          <div key={q.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 font-medium">
              {idx + 1}. {q.text}
            </div>
            <div className="grid grid-cols-1 gap-2">
              {q.options.map((opt) => {
                const active = answers[q.id] === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => pick(q.id, opt.key)}
                    className={`rounded-xl border px-3 py-2 text-left ${
                      active ? "border-brand-yellow bg-white/10" : "border-white/10 bg-white/5"
                    }`}
                  >
                    <span className="mr-2 font-semibold">{opt.key}.</span>
                    {opt.text}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <button
          onClick={submit}
          className="w-full rounded-xl bg-brand-yellow py-3 font-medium text-black transition hover:bg-brand-yellow/90"
        >
          Yuborish (mock)
        </button>
      </div>
    </div>
  );
}
