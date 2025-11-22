import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from "@/lib/apiClient";
import type { ExamDetailDto, AttemptSummaryDto } from "@/types/api";
import { Button } from "@/components/ui/button";
import { ExamTimer } from "@/components/ExamTimer";
import { AlertTriangle, Volume2, Maximize } from "lucide-react";
import { useRoleStore } from "@/store/roleStore";

export const ExamTaking = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const setRole = useRoleStore((state) => state.setRole);

  const [exam, setExam] = useState<ExamDetailDto | null>(null);
  const [attempt, setAttempt] = useState<AttemptSummaryDto | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({}); // questionId -> optionId
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [violations, setViolations] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Anti-Cheat: Fullscreen Enforcement
  const enterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
        if (attempt?.state === "active") {
          setViolations((v) => v + 1);
          setShowWarning(true);
        }
      } else {
        setIsFullscreen(true);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [attempt]);

  // Anti-Cheat: Disable Copy/Paste/Context Menu
  useEffect(() => {
    const preventDefault = (e: Event) => e.preventDefault();
    document.addEventListener("contextmenu", preventDefault);
    document.addEventListener("copy", preventDefault);
    document.addEventListener("paste", preventDefault);
    document.addEventListener("selectstart", preventDefault);

    return () => {
      document.removeEventListener("contextmenu", preventDefault);
      document.removeEventListener("copy", preventDefault);
      document.removeEventListener("paste", preventDefault);
      document.removeEventListener("selectstart", preventDefault);
    };
  }, []);

  // Fetch Exam & Create/Resume Attempt
  useEffect(() => {
    if (!examId) return;

    const initExam = async () => {
      try {
        setLoading(true);

        // 0. Get Current User
        const userRes = await apiClient.getCurrentUser();
        if (!userRes.success || !userRes.data) {
          throw new Error("Foydalanuvchi aniqlanmadi. Iltimos qayta kiring.");
        }
        const userId = userRes.data.tgId;
        setRole(userRes.data.role as "student" | "admin");

        // 1. Fetch Exam Details
        const examRes = await apiClient.getExamById(Number(examId));
        if (!examRes.success || !examRes.data) {
          throw new Error(examRes.error ?? "Imtihonni yuklab bo'lmadi");
        }
        setExam(examRes.data);

        // 2. Create or Resume Attempt
        const attemptsRes = await apiClient.getAttempts(userId);
        const activeAttempt = attemptsRes.data?.find(
          (a) => a.examId === Number(examId) && a.state === "active"
        );

        if (activeAttempt) {
          setAttempt(activeAttempt);
        } else {
          const createRes = await apiClient.createAttempt(Number(examId), userId);
          if (!createRes.success || !createRes.data) {
            // Check if already submitted
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
  }, [examId, navigate, setRole]);

  // Anti-Cheat: Visibility Change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && attempt?.state === "active") {
        setViolations((v) => v + 1);
        setShowWarning(true);
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
      {/* Fullscreen Warning Overlay */}
      {!isFullscreen && !loading && !error && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <Maximize className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">To'liq ekran rejimi talab qilinadi</h2>
            <p className="text-slate-400 mb-6">
              Imtihonni davom ettirish uchun to'liq ekran rejimiga o'tishingiz shart.
            </p>
            <Button onClick={enterFullscreen} className="bg-orange-500 hover:bg-orange-600 text-white w-full py-6 text-lg">
              To'liq ekranga o'tish
            </Button>
          </div>
        </div>
      )}

      {/* Violation Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/50 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl shadow-red-500/20">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Ogohlantirish!</h3>
            <p className="text-slate-300 mb-4">
              Siz imtihon oynasidan chiqdingiz yoki to'liq ekranni tark etdingiz.
              <br />
              <span className="text-red-400 font-bold mt-2 block">
                Qoidabuzarliklar soni: {violations}
              </span>
            </p>
            <Button
              onClick={() => {
                setShowWarning(false);
                enterFullscreen();
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Tushundim, davom etaman
            </Button>
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
