import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Lock, Clock3, Play, Loader2, ChevronLeft, ChevronRight, Flag, ShieldCheck, ShieldAlert } from "lucide-react";
import type { AppOutletContext } from "../App";
import { useSupabase } from "../providers/SupabaseProvider";
import { haptic } from "../lib/tg";

type ExamWindow = {
  start_at?: string | null;
  end_at?: string | null;
};

type ExamStatusRow = {
  exam_id: string;
  title: string;
  status: "UPCOMING" | "OPEN" | "CLOSED";
  duration_min: number | null;
  exam_windows?: ExamWindow[] | null;
  pass_min_correct?: number | null;
  review_policy?: string | null;
  shuffle_questions?: boolean | null;
  shuffle_answers?: boolean | null;
};

type QuestionOptionRow = {
  id: string;
  question_id: string;
  text: string;
  is_correct: boolean;
};

type QuestionRow = {
  id: string;
  text: string;
  type: string;
  points: number | null;
  explanation?: string | null;
  position?: number | null;
  question_options: QuestionOptionRow[];
};

type AttemptRuntime = {
  attemptId: string;
  exam: ExamStatusRow;
  questions: QuestionRow[];
  startedAt: number;
};

type AttemptSummary = {
  correct: number;
  total: number;
  passed: boolean | null;
  spentSeconds: number;
  passMinCorrect: number | null;
  reviewPolicy: string | null;
};

type AnswerMap = Record<string, string[]>;
type FlagMap = Record<string, boolean>;

const STATUS_COLORS: Record<ExamStatusRow["status"], string> = {
  OPEN: "bg-green-100 text-green-700",
  UPCOMING: "bg-amber-100 text-amber-700",
  CLOSED: "bg-gray-200 text-gray-600"
};

const QUESTION_MULTI_TYPES = new Set(["multiple", "multi", "checkbox", "multi_select"]);

export default function TestsPage() {
  const { user } = useOutletContext<AppOutletContext>();
  const { supabase } = useSupabase();

  const [exams, setExams] = useState<ExamStatusRow[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState<AttemptRuntime | null>(null);
  const [attemptError, setAttemptError] = useState<string | null>(null);
  const [startingExamId, setStartingExamId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [flags, setFlags] = useState<FlagMap>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [summary, setSummary] = useState<AttemptSummary | null>(null);

  const answersRef = useRef<AnswerMap>({});
  const pendingSaveRef = useRef(false);

  const loadExamStatuses = useCallback(async () => {
    if (!supabase) return;
    setListLoading(true);
    setListError(null);
    try {
      const { data, error } = await supabase
        .from("exam_status")
        .select(
          "exam_id,title,status,duration_min,exam_windows,pass_min_correct,review_policy,shuffle_questions,shuffle_answers"
        )
        .order("title", { ascending: true });

      if (error) {
        throw error;
      }

      const rows = (data ?? []) as ExamStatusRow[];
      setExams(rows);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load exams. Please pull to refresh.";
      setListError(message);
    } finally {
      setListLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    void loadExamStatuses();
  }, [loadExamStatuses]);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const persistAnswers = useCallback(async () => {
    if (!supabase || !attempt) return;
    const entries = Object.entries(answersRef.current);
    if (!entries.length) {
      pendingSaveRef.current = false;
      return;
    }

    try {
      await Promise.all(
        entries.map(([questionId, optionIds]) =>
          supabase
            .from("attempt_answers")
            .upsert({
              attempt_id: attempt.attemptId,
              question_id: questionId,
              option_ids: optionIds,
              updated_at: new Date().toISOString()
            })
        )
      );
      pendingSaveRef.current = false;
    } catch (error) {
      pendingSaveRef.current = false;
      const message =
        error instanceof Error ? error.message : "Autosave failed. Please check your connection.";
      setAttemptError(message);
    }
  }, [attempt, supabase]);

  useEffect(() => {
    if (!attempt || !supabase) return;
    const interval = window.setInterval(() => {
      if (pendingSaveRef.current) {
        void persistAnswers();
      }
    }, 12_000);
    return () => window.clearInterval(interval);
  }, [attempt, persistAnswers, supabase]);

  const resetAttemptState = useCallback(() => {
    setAttempt(null);
    setAnswers({});
    answersRef.current = {};
    setFlags({});
    setCurrentIndex(0);
    setStartingExamId(null);
    setAttemptError(null);
  }, []);

  const handleStartExam = useCallback(
    async (exam: ExamStatusRow) => {
      if (!supabase) return;
      haptic.tap?.();
      setStartingExamId(exam.exam_id);
      setAttemptError(null);

      try {
        const { data, error } = await supabase.rpc("start_attempt", { p_exam_id: exam.exam_id });
        if (error) throw error;

        const attemptId =
          typeof data === "string"
            ? data
            : (data as { attempt_id?: string })?.attempt_id ?? null;

        if (!attemptId) {
          throw new Error("start_attempt RPC did not return attempt_id.");
        }

        const [{ data: examMeta, error: examError }, { data: questionData, error: questionError }] =
          await Promise.all([
            supabase
              .from("exams")
              .select(
                "id,title,pass_min_correct,review_policy,shuffle_questions,shuffle_answers,duration_min"
              )
              .eq("id", exam.exam_id)
              .single(),
            supabase
              .from("questions")
              .select(
                "id,text,type,points,explanation,position,question_options(id,question_id,text,is_correct)"
              )
              .eq("exam_id", exam.exam_id)
              .order("position", { ascending: true })
          ]);

        if (examError) throw examError;
        if (questionError) throw questionError;

        const sanitizedQuestions = (questionData ?? []).map((question) => ({
          ...question,
          question_options: [...(question.question_options ?? [])].map((option) => ({
            ...option,
            is_correct: Boolean(option.is_correct)
          }))
        }));

        const mergedExam: ExamStatusRow = {
          ...exam,
          pass_min_correct: examMeta?.pass_min_correct ?? exam.pass_min_correct ?? null,
          review_policy: examMeta?.review_policy ?? exam.review_policy ?? null,
          shuffle_questions: examMeta?.shuffle_questions ?? exam.shuffle_questions ?? null,
          shuffle_answers: examMeta?.shuffle_answers ?? exam.shuffle_answers ?? null,
          duration_min: examMeta?.duration_min ?? exam.duration_min ?? null
        };

        const shuffledQuestions = (mergedExam.shuffle_questions ? shuffleArray(sanitizedQuestions) : sanitizedQuestions).map(
          (question) => ({
            ...question,
            question_options: mergedExam.shuffle_answers
              ? shuffleArray(question.question_options ?? [])
              : [...(question.question_options ?? [])]
          })
        );

        setAttempt({
          attemptId,
          exam: mergedExam,
          questions: shuffledQuestions,
          startedAt: Date.now()
        });
        setSummary(null);
        setAnswers({});
        answersRef.current = {};
        setFlags({});
        setCurrentIndex(0);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to start the exam. Please try again in a moment.";
        setAttemptError(message);
        resetAttemptState();
      } finally {
        setStartingExamId(null);
      }
    },
    [resetAttemptState, supabase]
  );

  const handleToggleOption = useCallback(
    (question: QuestionRow, optionId: string) => {
      setAnswers((prev) => {
        const previousSelections = prev[question.id] ?? [];
        const isMultiple = QUESTION_MULTI_TYPES.has((question.type ?? "").toLowerCase());
        let nextSelections: string[];

        if (isMultiple) {
          if (previousSelections.includes(optionId)) {
            nextSelections = previousSelections.filter((value) => value !== optionId);
          } else {
            nextSelections = [...previousSelections, optionId];
          }
        } else {
          nextSelections = [optionId];
        }

        const next = { ...prev, [question.id]: nextSelections };
        answersRef.current = next;
        pendingSaveRef.current = true;
        return next;
      });

      void persistAnswers();
    },
    [persistAnswers]
  );

  const handleToggleFlag = useCallback((questionId: string) => {
    setFlags((prev) => {
      const next = { ...prev, [questionId]: !prev[questionId] };
      return next;
    });
  }, []);

  const handleSubmitAttempt = useCallback(async () => {
    if (!supabase || !attempt) return;
    setSubmitting(true);
    setAttemptError(null);
    pendingSaveRef.current = true;
    await persistAnswers();

    try {
      const { error } = await supabase
        .from("attempts")
        .update({ state: "submitted", submitted_at: new Date().toISOString() })
        .eq("id", attempt.attemptId);

      if (error) throw error;

      const computedSummary = computeSummary(
        attempt.questions,
        answersRef.current,
        attempt.exam.pass_min_correct ?? null,
        attempt.exam.review_policy ?? null,
        attempt.startedAt
      );
      setSummary(computedSummary);
      haptic.success?.();
      await loadExamStatuses();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Submit failed. Please check your connection and retry.";
      setAttemptError(message);
    } finally {
      setSubmitting(false);
    }
  }, [attempt, loadExamStatuses, persistAnswers, supabase]);

  const currentQuestion = attempt?.questions[currentIndex];

  const upcomingMessage = useMemo(() => {
    if (!attempt && exams.length === 0 && !listLoading && !listError) {
      return "No exams found. Please check back later.";
    }
    return null;
  }, [attempt, exams.length, listError, listLoading]);

  return (
    <section className="flex flex-col gap-4 pb-28">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold" style={{ color: "var(--fg)" }}>
          {user?.fullName ? `Salom, ${user.fullName.split(" ")[0]}!` : "Available exams"}
        </h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Authenticated through Telegram Mini App. Select an open exam to begin your attempt.
        </p>
      </header>

      {listLoading && (
        <div className="flex items-center gap-2 rounded-2xl border border-[var(--divider)] bg-[var(--card)] px-4 py-3 text-sm">
          <Loader2 className="h-4 w-4 animate-spin text-[var(--muted)]" />
          <span>Loading exams...</span>
        </div>
      )}

      {listError && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <ShieldAlert className="mt-0.5 h-4 w-4" />
          <div>
            <p>{listError}</p>
            <button
              type="button"
              className="mt-2 text-xs font-semibold underline"
              onClick={() => loadExamStatuses()}
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {!attempt && summary && (
        <AttemptSummaryCard
          summary={summary}
          onClose={() => {
            setSummary(null);
            resetAttemptState();
          }}
        />
      )}

      {!attempt && !summary && upcomingMessage && (
        <div className="rounded-2xl border border-[var(--divider)] bg-[var(--card)] px-4 py-6 text-center text-sm text-[var(--muted)]">
          {upcomingMessage}
        </div>
      )}

      {!attempt && !summary && (
        <div className="flex flex-col gap-3">
          {exams.map((exam) => (
            <ExamCard
              key={exam.exam_id}
              exam={exam}
              onStart={() => handleStartExam(exam)}
              isStarting={startingExamId === exam.exam_id}
            />
          ))}
        </div>
      )}

      {attempt && currentQuestion && (
        <div className="attempt-no-copy flex flex-col gap-4">
          <AntiCopyGuards />

          <div className="flex items-center justify-between rounded-2xl border border-[var(--divider)] bg-[var(--card)] px-4 py-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-[var(--muted)]">Exam</p>
              <h2 className="text-base font-semibold">{attempt.exam.title}</h2>
            </div>
            <div className="flex items-center gap-3 text-sm text-[var(--muted)]">
              {attempt.exam.duration_min ? (
                <span className="inline-flex items-center gap-1">
                  <Clock3 className="h-4 w-4" /> {formatMinutes(attempt.exam.duration_min)}
                </span>
              ) : null}
              <span>
                Question {currentIndex + 1} / {attempt.questions.length}
              </span>
            </div>
          </div>

          <nav className="flex flex-wrap gap-2 rounded-2xl border border-[var(--divider)] bg-[var(--card)] px-4 py-3 text-sm">
            {attempt.questions.map((question, index) => {
              const isActive = index === currentIndex;
              const hasAnswer = (answersRef.current[question.id] ?? []).length > 0;
              const isFlagged = flags[question.id];

              return (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-sm font-medium transition ${
                    isActive
                      ? "border-[var(--brand-yellow)] bg-[var(--brand-yellow)] text-black"
                      : hasAnswer
                      ? "border-green-400 bg-green-100 text-green-700"
                      : "border-[var(--divider)] bg-[var(--card)]"
                  }`}
                  aria-label={`Go to question ${index + 1}`}
                >
                  {index + 1}
                  {isFlagged ? <span className="sr-only"> flagged</span> : null}
                </button>
              );
            })}
          </nav>

          <QuestionCard
            question={currentQuestion}
            answers={answersRef.current[currentQuestion.id] ?? []}
            onToggleOption={handleToggleOption}
            isMultiple={QUESTION_MULTI_TYPES.has((currentQuestion.type ?? "").toLowerCase())}
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="btn btn-ghost flex items-center gap-2 px-3 py-2 text-sm"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((index) => Math.max(index - 1, 0))}
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </button>
              <button
                type="button"
                className="btn btn-ghost flex items-center gap-2 px-3 py-2 text-sm"
                disabled={currentIndex >= attempt.questions.length - 1}
                onClick={() =>
                  setCurrentIndex((index) => Math.min(index + 1, attempt.questions.length - 1))
                }
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className={`btn btn-ghost flex items-center gap-2 px-3 py-2 text-sm ${
                  flags[currentQuestion.id] ? "!bg-amber-100 text-amber-700" : ""
                }`}
                onClick={() => handleToggleFlag(currentQuestion.id)}
              >
                <Flag className="h-4 w-4" />
                {flags[currentQuestion.id] ? "Unflag" : "Flag"}
              </button>
              <button
                type="button"
                className="btn btn-primary flex items-center gap-2 px-4 py-2 text-sm font-semibold"
                onClick={handleSubmitAttempt}
                disabled={submitting}
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ShieldCheck className="h-4 w-4" />
                )}
                Submit
              </button>
            </div>
          </div>

          {attemptError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {attemptError}
            </div>
          )}
        </div>
      )}

      {!attempt && attemptError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {attemptError}
        </div>
      )}
    </section>
  );
}

function ExamCard({
  exam,
  onStart,
  isStarting
}: {
  exam: ExamStatusRow;
  onStart: () => void;
  isStarting: boolean;
}) {
  const statusClass = STATUS_COLORS[exam.status] ?? "bg-gray-200 text-gray-600";
  const nextWindow = getNextWindowStart(exam.exam_windows ?? []);

  return (
    <article className="card flex flex-col gap-3 p-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: "var(--fg)" }}>
            {exam.title}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
            {exam.duration_min ? (
              <span className="inline-flex items-center gap-1">
                <Clock3 className="h-4 w-4" />
                {formatMinutes(exam.duration_min)}
              </span>
            ) : (
              <span>No duration limit</span>
            )}
          </div>
        </div>
        <span className={`badge ${statusClass}`}>{exam.status}</span>
      </header>

      {exam.status === "OPEN" && (
        <button
          type="button"
          onClick={onStart}
          className="btn btn-primary flex items-center justify-center gap-2 text-sm font-semibold"
          disabled={isStarting}
        >
          {isStarting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}{" "}
          {isStarting ? "Preparing attempt..." : "Start"}
        </button>
      )}

      {exam.status === "UPCOMING" && (
        <div className="flex items-start gap-2 text-sm text-[var(--muted)]">
          <Lock className="h-4 w-4" />
          <div>
            <p>Exam is locked. Please wait for the scheduled start.</p>
            {nextWindow ? (
              <p className="mt-1 text-xs uppercase tracking-wide text-amber-600">
                Starts {formatDateTime(nextWindow)}
              </p>
            ) : null}
          </div>
        </div>
      )}

      {exam.status === "CLOSED" && (
        <p className="text-sm text-[var(--muted)]">This exam has been closed.</p>
      )}
    </article>
  );
}

function QuestionCard({
  question,
  answers,
  onToggleOption,
  isMultiple
}: {
  question: QuestionRow;
  answers: string[];
  onToggleOption: (question: QuestionRow, optionId: string) => void;
  isMultiple: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[var(--divider)] bg-[var(--card)] px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold" style={{ color: "var(--fg)" }}>
          {question.text}
        </h3>
        <span className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
          {isMultiple ? "Multiple choice" : "Single choice"}
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {question.question_options.map((option) => {
          const checked = answers.includes(option.id);
          return (
            <label
              key={option.id}
              className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-3 py-3 transition ${
                checked
                  ? "border-[var(--brand-yellow)] bg-[color-mix(in_oklab,var(--brand-yellow)_18%,transparent)]"
                  : "border-[var(--divider)] hover:bg-[color-mix(in_oklab,var(--card)_90%,transparent)]"
              }`}
            >
              <input
                type={isMultiple ? "checkbox" : "radio"}
                name={question.id}
                checked={checked}
                onChange={() => onToggleOption(question, option.id)}
                className="h-4 w-4"
              />
              <span>{option.text}</span>
            </label>
          );
        })}
      </div>

      {question.explanation ? (
        <p className="mt-4 text-xs text-[var(--muted)]">Note: {question.explanation}</p>
      ) : null}
    </div>
  );
}

function AttemptSummaryCard({
  summary,
  onClose
}: {
  summary: AttemptSummary;
  onClose: () => void;
}) {
  const { correct, total, passed, spentSeconds, passMinCorrect, reviewPolicy } = summary;
  const badgeClass =
    passed === null
      ? "bg-gray-200 text-gray-700"
      : passed
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

  return (
    <div className="card flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: "var(--fg)" }}>
            Attempt submitted
          </h2>
          <p className="text-sm text-[var(--muted)]">
            Review policy: {reviewPolicy ?? "score_only"}
          </p>
        </div>
        <span className={`badge ${badgeClass}`}>
          {passed === null ? "Score only" : passed ? "Passed" : "Failed"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm text-[var(--muted)]">
        <div className="rounded-xl border border-[var(--divider)] bg-[var(--card)] px-3 py-2">
          <p className="text-xs uppercase tracking-wide text-[var(--muted)]">Correct answers</p>
          <p className="text-base font-semibold text-[var(--fg)]">
            {correct} / {total}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--divider)] bg-[var(--card)] px-3 py-2">
          <p className="text-xs uppercase tracking-wide text-[var(--muted)]">Time spent</p>
          <p className="text-base font-semibold text-[var(--fg)]">
            {formatSeconds(spentSeconds)}
          </p>
        </div>
        {passMinCorrect !== null ? (
          <div className="rounded-xl border border-[var(--divider)] bg-[var(--card)] px-3 py-2">
            <p className="text-xs uppercase tracking-wide text-[var(--muted)]">Passing threshold</p>
            <p className="text-base font-semibold text-[var(--fg)]">{passMinCorrect} correct</p>
          </div>
        ) : null}
      </div>

      <button type="button" className="btn btn-primary mt-2" onClick={onClose}>
        Back to exams
      </button>
    </div>
  );
}

function AntiCopyGuards() {
  useEffect(() => {
    const preventDefault = (event: Event) => {
      event.preventDefault();
    };

    const interceptKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && (event.key === "c" || event.key === "C")) {
        event.preventDefault();
      }
    };

    const logVisibility = () => {
      // eslint-disable-next-line no-console
      console.log("[exam] visibilitychange:", document.visibilityState);
    };

    document.addEventListener("contextmenu", preventDefault);
    document.addEventListener("copy", preventDefault);
    document.addEventListener("keydown", interceptKey);
    document.addEventListener("visibilitychange", logVisibility);

    return () => {
      document.removeEventListener("contextmenu", preventDefault);
      document.removeEventListener("copy", preventDefault);
      document.removeEventListener("keydown", interceptKey);
      document.removeEventListener("visibilitychange", logVisibility);
    };
  }, []);

  return null;
}

function getNextWindowStart(windows: ExamWindow[]) {
  const valid = windows
    .map((window) => window.start_at)
    .filter((value): value is string => Boolean(value))
    .map((value) => new Date(value).getTime())
    .filter((value) => !Number.isNaN(value))
    .sort((a, b) => a - b);

  if (!valid.length) return null;
  const now = Date.now();
  const upcoming = valid.find((value) => value > now);
  return new Date(upcoming ?? valid[0]);
}

function shuffleArray<T>(source: T[]): T[] {
  const clone = [...source];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

function formatMinutes(minutes: number | null) {
  if (!minutes || minutes <= 0) return "Flexible timing";
  return `${minutes} min`;
}

function formatDateTime(date: Date | null) {
  if (!date) return "Schedule shared soon";
  try {
    return new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "short"
    }).format(date);
  } catch {
    return date.toLocaleString();
  }
}

function formatSeconds(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "—";
  const mins = Math.floor(seconds / 60);
  const rem = seconds % 60;
  return `${mins}m ${rem}s`;
}

function computeSummary(
  questions: QuestionRow[],
  answers: AnswerMap,
  passMinCorrect: number | null,
  reviewPolicy: string | null,
  startedAt: number
): AttemptSummary {
  let correct = 0;

  questions.forEach((question) => {
    const selected = (answers[question.id] ?? []).slice().sort();
    const correctOptions = (question.question_options ?? [])
      .filter((option) => option.is_correct)
      .map((option) => option.id)
      .sort();

    if (correctOptions.length === 0) {
      return;
    }

    if (
      selected.length === correctOptions.length &&
      selected.every((value, index) => value === correctOptions[index])
    ) {
      correct += 1;
    }
  });

  const spentSeconds = Math.max(Math.round((Date.now() - startedAt) / 1000), 0);
  const passed =
    passMinCorrect === null ? null : correct >= Math.max(passMinCorrect, 0) ? true : false;

  return {
    correct,
    total: questions.length,
    passed,
    spentSeconds,
    passMinCorrect,
    reviewPolicy: reviewPolicy ?? "score_only"
  };
}
