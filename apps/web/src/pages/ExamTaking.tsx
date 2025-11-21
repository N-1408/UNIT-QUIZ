import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from "@/lib/apiClient";
import type { ExamDetailDto, AttemptSummaryDto } from "@/types/api";
import { Button } from "@/components/ui/button";
import { ExamTimer } from "@/components/ExamTimer";
import { AlertTriangle, Volume2 } from "lucide-react";

// Hardcoded for prototype, should come from auth context
const STUDENT_ID = 7409467049;

export const ExamTaking = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();

  const [exam, setExam] = useState<ExamDetailDto | null>(null);
  const [attempt, setAttempt] = useState<AttemptSummaryDto | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({}); // questionId -> optionId
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  // Fetch Exam & Create/Resume Attempt
  useEffect(() => {
    if (!examId) return;

    const initExam = async () => {
      try {
        setLoading(true);

        // 1. Fetch Exam Details
        const examRes = await apiClient.getExamById(Number(examId));
        if (!examRes.success || !examRes.data) {
          throw new Error(examRes.error ?? "Imtihonni yuklab bo'lmadi");
        }
        setExam(examRes.data);

        // 2. Create or Resume Attempt
        // Check if we already have an active attempt locally or fetch from server
        // For now, we'll just try to create a new one, and if it fails (e.g. limit reached), handle it.
        // Ideally, we should check for *active* attempts first.
        // Simplified flow: Always try to create/resume via a robust backend endpoint.
        // Since our backend `createAttempt` doesn't handle "resume" logic explicitly (it just creates new),
        // we might need to fetch attempts first.

        const attemptsRes = await apiClient.getAttempts(STUDENT_ID);
        const activeAttempt = attemptsRes.data?.find(
          (a) => a.examId === Number(examId) && a.state === "active"
        );

        if (activeAttempt) {
          setAttempt(activeAttempt);
        } else {
          const createRes = await apiClient.createAttempt(Number(examId), STUDENT_ID);
          if (!createRes.success || !createRes.data) {
            // If creation failed, maybe they reached the limit?
            // Check if they have a submitted attempt
            const submittedAttempt = attemptsRes.data?.find(
              (a) => a.examId === Number(examId) && a.state !== "active"
            );
            if (submittedAttempt) {
              alert("Siz bu imtihonni allaqachon topshirgansiz!");
              navigate("/results");
              return;
            }
            throw new Error(createRes.error ?? "Imtihonni boshlab bo'lmadi");
          }
          setAttempt(createRes.data);
        }

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initExam();
  }, [examId, navigate]);

  // Anti-Cheat: Visibility Change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && attempt?.state === "active") {
        setShowWarning(true);
        // Optional: Auto-submit after X seconds of background
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [attempt]);

  // Prevent closing tab
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (attempt?.state === "active") {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [attempt]);

  const handleAnswerSelect = (questionId: number, optionId: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = useCallback(async () => {
    if (!attempt || submitting) return;

    if (!window.confirm("Imtihonni haqiqatdan ham topshirmoqchimisiz?")) return;

    setSubmitting(true);
    try {
      // Calculate duration
      const startTime = new Date(attempt.startedAt!).getTime();
      const durationSec = Math.floor((Date.now() - startTime) / 1000);

      const res = await apiClient.submitAttempt(attempt.id, {
        answers,
        durationSpentSec: durationSec
      });

      if (res.success) {
        navigate("/results", { state: { attempt: res.data } });
      } else {
        alert("Xatolik yuz berdi: " + res.error);
      }
    } catch (err) {
      console.error(err);
      alert("Internet bilan aloqa yo'qolgan bo'lishi mumkin.");
    } finally {
      setSubmitting(false);
    }
  }, [attempt, answers, navigate, submitting]);

  const handleTimeOut = useCallback(() => {
    alert("Vaqt tugadi! Javoblar avtomatik yuborilmoqda...");
    handleSubmit();
  }, [handleSubmit]);

  if (loading) return <div className="flex h-screen items-center justify-center text-white">Yuklanmoqda...</div>;
  if (error) return <div className="flex h-screen items-center justify-center text-red-500">{error}</div>;
  if (!exam || !exam.questions || !attempt) return null;

  const currentQuestion = exam.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === exam.questions.length - 1;

  // Calculate end time
  const endTime = new Date(new Date(attempt.startedAt!).getTime() + (exam.durationMin ?? 30) * 60000);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col pb-20 font-sans selection:bg-orange-500/30">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/80 backdrop-blur-md px-4 py-3 flex items-center justify-between">
        <div className="text-sm font-medium text-slate-400">
          Savol {currentQuestionIndex + 1} / {exam.questions.length}
        </div>
        <ExamTimer endTimeISO={endTime.toISOString()} onTimeout={handleTimeOut} />
      </div>

      {/* Warning Alert */}
      {showWarning && (
        <div className="bg-red-500/10 border-l-4 border-red-500 p-4 m-4 rounded-r flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-red-500 text-sm">Diqqat!</h4>
            <p className="text-xs text-red-200/80">
              Imtihon vaqtida ilovadan chiqish taqiqlanadi. Bu holat qayd etildi.
            </p>
            <button
              onClick={() => setShowWarning(false)}
              className="text-xs underline mt-1 text-red-400 hover:text-red-300"
            >
              Tushundim
            </button>
          </div>
        </div>
      )}

      {/* Question Area */}
      <div className="flex-1 p-4 max-w-2xl mx-auto w-full">
        <div className="mb-6">
          <h2 className="text-xl font-semibold leading-relaxed text-white mb-4">
            {currentQuestion.text}
          </h2>

          {currentQuestion.imageUrl && (
            <div className="rounded-xl overflow-hidden border border-white/10 mb-4 bg-black/20">
              <img src={currentQuestion.imageUrl} alt="Question" className="w-full h-auto object-contain max-h-64" />
            </div>
          )}

          {currentQuestion.audioUrl && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 mb-4">
              <Volume2 className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-orange-200">Audio savol tinglash</span>
              {/* Audio player would go here */}
            </div>
          )}
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options?.map((option) => {
            const isSelected = answers[currentQuestion.id] === option.id;
            return (
              <div
                key={option.id}
                onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
                className={`
                  relative group cursor-pointer rounded-xl border p-4 transition-all duration-200 ease-out
                  ${isSelected
                    ? "bg-orange-500/20 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.15)]"
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                    ${isSelected ? "border-orange-500 bg-orange-500" : "border-slate-600 group-hover:border-slate-500"}
                  `}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <span className={`text-base ${isSelected ? "text-white font-medium" : "text-slate-300"}`}>
                    {option.text}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="sticky bottom-0 border-t border-white/10 bg-slate-950/80 backdrop-blur-md p-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          <Button
            variant="outline"
            className="flex-1 border-white/10 text-slate-400 hover:bg-white/5 hover:text-white"
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
          >
            Oldingi
          </Button>

          {isLastQuestion ? (
            <Button
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white shadow-lg shadow-green-500/20"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Yuborilmoqda..." : "Yakunlash"}
            </Button>
          ) : (
            <Button
              className="flex-1"
              onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
            >
              Keyingi
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
