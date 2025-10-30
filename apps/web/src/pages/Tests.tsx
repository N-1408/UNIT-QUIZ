import { useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Clock3, CheckCircle, XCircle } from "lucide-react";
import type { AppOutletContext } from "../App";

type TestHistory = {
  correct: number;
  total: number;
  duration: string;
  finishedAt: string;
};

type TestItem = {
  id: string;
  title: string;
  unit: string;
  isNew: boolean;
  lastScore?: number;
  total?: number;
  lastDuration?: string;
  history?: TestHistory;
};

const mockTests: TestItem[] = [
  {
    id: "starter",
    title: "Starter Placement",
    unit: "Placement",
    isNew: true
  },
  {
    id: "unit-1",
    title: "Unit 1 — Academic Skills",
    unit: "Unit 1",
    isNew: false,
    lastScore: 8,
    total: 10,
    lastDuration: "6:34",
    history: {
      correct: 8,
      total: 10,
      duration: "6:34",
      finishedAt: "2025-10-18T17:43:00+05:00"
    }
  },
  {
    id: "speaking-lite",
    title: "Speaking Lite",
    unit: "Speaking Prep",
    isNew: false,
    lastScore: 5,
    total: 6,
    lastDuration: "7:10",
    history: {
      correct: 5,
      total: 6,
      duration: "7:10",
      finishedAt: "2025-10-15T11:05:00+05:00"
    }
  }
];

export default function TestsPage() {
  const navigate = useNavigate();
  const { user } = useOutletContext<AppOutletContext>();
  const [selectedTest, setSelectedTest] = useState<TestItem | null>(null);

  const tests = useMemo(() => mockTests, []);
  const firstName = useMemo(() => user?.fullName?.split(" ")[0] ?? "Student", [user?.fullName]);

  return (
    <section className="flex flex-col gap-4 pb-28">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: "var(--fg)" }}>
            Welcome, {firstName}
          </h1>
          <p className="text-xs uppercase tracking-wide" style={{ color: "var(--muted)" }}>
            inter-nation.uz mini tests
          </p>
        </div>
        <span className="badge">Demo</span>
      </div>
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        New tests will appear automatically. Final scores will sync with Supabase soon.
      </p>

      <div className="mt-2 flex flex-col gap-3">
        {tests.map((test) => {
          const handleClick = () => {
            if (test.isNew) {
              navigate(`/test/${test.id}`);
            } else {
              setSelectedTest(test);
            }
          };

          const isNew = test.isNew;

          return (
            <button
              key={test.id}
              onClick={handleClick}
              className="card flex flex-col gap-3 p-4 text-left transition"
              style={{ boxShadow: "0 1px 8px rgba(0, 0, 0, 0.05)" }}
            >
              <div className="flex items-start gap-3">
                <div>
                  <span className="text-xs uppercase tracking-wide" style={{ color: "var(--muted)" }}>
                    {test.unit}
                  </span>
                  <h2 className="text-lg font-semibold" style={{ color: "var(--fg)" }}>
                    {test.title}
                  </h2>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  {test.lastScore != null && test.total != null && (
                    <span
                      className="badge font-semibold"
                      style={{
                        background: "color-mix(in oklab, var(--green) 20%, transparent)",
                        color: "var(--green)"
                      }}
                    >
                      {test.lastScore}/{test.total}
                    </span>
                  )}
                  {test.lastDuration && (
                    <span
                      className="badge"
                      style={{
                        background: "color-mix(in oklab, var(--muted) 14%, transparent)",
                        color: "var(--muted)"
                      }}
                    >
                      <Clock3 size={14} /> {test.lastDuration}
                    </span>
                  )}
                  {isNew && (
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
                      style={{ background: "var(--brand-yellow)", color: "var(--brand-black)" }}
                    >
                      New
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                {test.isNew
                  ? "This test hasn’t been taken yet. Your first attempt counts towards the ranking."
                  : "Latest attempt recorded. Replays are for practice only."}
              </p>
              {!test.isNew && test.history && (
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  Last attempt: {new Date(test.history.finishedAt).toLocaleString("uz-UZ")}
                </p>
              )}
            </button>
          );
        })}
      </div>

      {selectedTest?.history && (
        <TestHistoryModal
          test={selectedTest}
          onClose={() => setSelectedTest(null)}
          onRetake={() => {
            navigate(`/test/${selectedTest.id}`);
            setSelectedTest(null);
          }}
        />
      )}
    </section>
  );
}

type TestHistoryModalProps = {
  test: TestItem;
  onClose: () => void;
  onRetake: () => void;
};

function TestHistoryModal({ test, onClose, onRetake }: TestHistoryModalProps) {
  const history = test.history!;
  const stats = {
    correct: history.correct,
    wrong: history.total - history.correct,
    time: history.duration
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center" style={{ background: 'var(--overlay)' }}>
      <div className="w-full max-w-md rounded-t-3xl border border-[var(--divider)] bg-[var(--bg)] p-5 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide" style={{ color: "var(--muted)" }}>
              {test.unit}
            </p>
            <h3 className="text-xl font-semibold" style={{ color: "var(--fg)" }}>
              {test.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost text-sm text-[var(--muted)]"
          >
            Close
          </button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="card p-3">
            <div className="flex items-center justify-center gap-1 text-state-green">
              <CheckCircle size={18} /> <span className="text-sm">Correct</span>
            </div>
            <div className="text-2xl font-semibold" style={{ color: "var(--fg)" }}>
              {stats.correct}
            </div>
          </div>
          <div className="card p-3">
            <div className="flex items-center justify-center gap-1 text-state-red">
              <XCircle size={18} /> <span className="text-sm">Wrong</span>
            </div>
            <div className="text-2xl font-semibold" style={{ color: "var(--fg)" }}>
              {stats.wrong}
            </div>
          </div>
          <div className="card p-3">
            <div className="flex items-center justify-center gap-1 opacity-80">
              <Clock3 size={18} /> <span className="text-sm">Time</span>
            </div>
            <div className="text-2xl font-semibold" style={{ color: "var(--fg)" }}>
              {stats.time}
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs" style={{ color: "var(--muted)" }}>
          Only the first attempt counts towards the ranking. Replays are great for revision.
        </p>

        <div className="mt-5 flex flex-col gap-2">
          <button type="button" onClick={onRetake} className="btn-primary">
            Retake test
          </button>
          <button type="button" onClick={onClose} className="btn-ghost text-sm text-[var(--muted)]">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
