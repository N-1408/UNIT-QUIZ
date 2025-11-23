import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiClient } from "@/lib/apiClient";
import type { ExamDetailDto, AttemptSummaryDto } from "@/types/api";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Volume2, Maximize } from "lucide-react";
import { useAuthStore } from "@/store/useAuth";

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
  const [violations, setViolations] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { t } = useTranslation();

  // Anti-Cheat: Fullscreen Enforcement
  const enterFullscreen = async () => {
    try {
      const elem = document.documentElement as any;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) { /* Safari */
        await elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE11 */
        await elem.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } catch (err) {
      console.error("Fullscreen error:", err);
      // Fallback for browsers that block it or fail
      // We might want to allow them to proceed if it fails repeatedly, or show a specific error
      alert("Fullscreen request failed. Please try tapping the button again.");
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = document.fullscreenElement || (document as any).webkitFullscreenElement;
      if (!isFull) {
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
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange); // Safari
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, [attempt]);

  const session = useAuthStore((state) => state.session);

  useEffect(() => {
    const loadExam = async () => {
      if (!examId || !session?.telegramId) return;
      try {
        const id = parseInt(examId);
        const res = await apiClient.getExamById(id);
        if (res.success && res.data) {
          setExam(res.data);
          // Start attempt
          const attemptRes = await apiClient.createAttempt(id, Number(session.telegramId));
          if (attemptRes.success && attemptRes.data) {
            setAttempt(attemptRes.data);
          }
        } else {
          setError("Exam not found");
        }
      } catch (err) {
        setError("Failed to load exam");
      } finally {
        setLoading(false);
      }
    };
    loadExam();
  }, [examId, session]);

  const handleAnswerSelect = (questionId: number, optionId: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    if (!attempt) return;
    setSubmitting(true);
    try {
      await apiClient.submitAttempt(attempt.id, {
        answers,
        durationSpentSec: 0
      });
      navigate("/results");
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-white">Loading...</div>;
  if (error) return <div className="flex h-screen items-center justify-center text-red-500">{error}</div>;
  if (!exam || !exam.questions) return null;

  const currentQuestion = exam.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === exam.questions.length - 1;

  return (
    <>
      {/* Fullscreen Warning Overlay */}
      {
        !isFullscreen && !loading && !error && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-6">
            <div className="text-center max-w-md w-full">
              <Maximize className="w-16 h-16 text-orange-500 mx-auto mb-6 animate-pulse" />
              <h2 className="text-2xl font-bold text-white mb-3">{t("exam.fullscreen_required")}</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                {t("exam.fullscreen_desc")}
              </p>
              <div className="space-y-3">
                <Button onClick={enterFullscreen} className="bg-orange-500 hover:bg-orange-600 text-white w-full py-6 text-lg shadow-lg shadow-orange-500/20">
                  {t("exam.enter_fullscreen")}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  className="w-full text-slate-400 hover:text-white hover:bg-white/5"
                >
                  {t("exam.back")}
                </Button>
              </div>
            </div>
          </div>
        )
      }

      {/* Violation Warning Modal */}
      {
        showWarning && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-red-500/50 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl shadow-red-500/20">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">{t("exam.warning")}</h3>
              <p className="text-slate-300 mb-4">
                {t("exam.violation_desc")}
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
                {t("exam.understood")}
              </Button>
            </div>
          </div>
        )
      }

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

    </>
  );
};
