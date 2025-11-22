import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/apiClient";
import type { AttemptSummaryDto } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, Share2, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

// Mock Leaderboard Data (replace with API later)
const MOCK_LEADERBOARD = [
  { id: 1, name: "Azizbek", score: 95, avatar: "👨‍🎓", rank: 1 },
  { id: 2, name: "Malika", score: 92, avatar: "👩‍🎓", rank: 2 },
  { id: 3, name: "Sardor", score: 88, avatar: "👨‍💻", rank: 3 },
  { id: 4, name: "Diyora", score: 85, avatar: "👩‍💻", rank: 4 },
  { id: 5, name: "Jasur", score: 82, avatar: "🙋‍♂️", rank: 5 },
];

export const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState<AttemptSummaryDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"result" | "leaderboard">("result");

  useEffect(() => {
    const init = async () => {
      // 1. Try to get attempt from navigation state
      if (location.state?.attempt) {
        setAttempt(location.state.attempt);
        setLoading(false);
        if (location.state.attempt.score >= 60) {
          triggerConfetti();
        }
        return;
      }

      // 2. Fallback: Fetch last attempt from API
      const userRes = await apiClient.getCurrentUser();
      if (userRes.success && userRes.data) {
        const res = await apiClient.getAttempts(userRes.data.tgId);
        if (res.success && res.data && res.data.length > 0) {
          const lastSubmitted = res.data.find(a => a.state === "submitted" || a.state === "graded");
          if (lastSubmitted) {
            setAttempt(lastSubmitted);
            if ((lastSubmitted.score ?? 0) >= 60) {
              triggerConfetti();
            }
          }
        }
      }
      setLoading(false);
    };

    init();
  }, [location.state]);

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-white">Natijalar yuklanmoqda...</div>;
  }

  if (!attempt) {
    return (
      <div className="flex flex-col h-screen items-center justify-center text-white p-4 text-center">
        <h2 className="text-2xl font-bold mb-2">Hali natijalar yo'q</h2>
        <p className="text-slate-400 mb-6">Imtihon topshirganingizdan so'ng natijalar shu yerda ko'rinadi.</p>
        <Button onClick={() => navigate("/exams")}>Imtihonlarga o'tish</Button>
      </div>
    );
  }

  const score = attempt.score ?? 0;
  const isPass = score >= 60;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 pb-24 font-sans">
      {/* Header Tabs */}
      <div className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md p-4">
        <div className="mx-auto flex max-w-md rounded-full bg-white/10 p-1">
          <button
            onClick={() => setActiveTab("result")}
            className={cn(
              "flex-1 rounded-full py-2 text-sm font-bold transition-all",
              activeTab === "result" ? "bg-brand text-white shadow-lg" : "text-slate-400 hover:text-white"
            )}
          >
            Natijam
          </button>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={cn(
              "flex-1 rounded-full py-2 text-sm font-bold transition-all",
              activeTab === "leaderboard" ? "bg-brand text-white shadow-lg" : "text-slate-400 hover:text-white"
            )}
          >
            Reyting
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-md p-4 space-y-6">
        {activeTab === "result" ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Score Card */}
            <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-brand to-brand-gradient1 p-8 text-center shadow-2xl shadow-brand/30">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

              <div className="relative z-10">
                <h1 className="text-2xl font-bold text-white mb-1">{attempt.examTitle ?? "Imtihon Natijasi"}</h1>
                <p className="text-brand-light/80 text-sm mb-8">
                  {new Date(attempt.submittedAt!).toLocaleDateString()} • {new Date(attempt.submittedAt!).toLocaleTimeString()}
                </p>

                <div className="relative mx-auto mb-8 flex h-48 w-48 items-center justify-center">
                  {/* Outer Glow Ring */}
                  <div className="absolute inset-0 rounded-full bg-white/20 blur-xl animate-pulse"></div>
                  {/* Progress Ring Background */}
                  <svg className="h-full w-full -rotate-90 transform">
                    <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-black/10" />
                    <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={2 * Math.PI * 88} strokeDashoffset={2 * Math.PI * 88 * (1 - score / 100)} className="text-white transition-all duration-1000 ease-out" strokeLinecap="round" />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-6xl font-black text-white tracking-tighter">{score}</span>
                    <span className="text-sm font-bold text-brand-light uppercase tracking-widest">Ball</span>
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  <div className="flex items-center gap-2 rounded-2xl bg-black/20 px-4 py-2 backdrop-blur-sm">
                    <Clock className="w-4 h-4 text-brand-light" />
                    <span className="text-sm font-bold">{Math.floor((attempt.durationSpentSec ?? 0) / 60)} daq</span>
                  </div>
                  <div className={cn("flex items-center gap-2 rounded-2xl px-4 py-2 backdrop-blur-sm", isPass ? "bg-green-500/20 text-green-100" : "bg-red-500/20 text-red-100")}>
                    {isPass ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    <span className="text-sm font-bold">{isPass ? "O'tdi" : "Yiqildi"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <Button variant="outline" className="h-14 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white" onClick={() => navigate("/exams")}>
                <RotateCcw className="mr-2 h-5 w-5" />
                Qayta
              </Button>
              <Button className="h-14 rounded-2xl bg-white text-brand hover:bg-white/90" onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'Mening Natijam',
                    text: `Men ${attempt.examTitle} imtihonidan ${score} ball oldim!`,
                    url: window.location.href,
                  });
                }
              }}>
                <Share2 className="mr-2 h-5 w-5" />
                Ulashish
              </Button>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-4">
            {/* Podium */}
            <div className="flex items-end justify-center gap-4 pb-8 pt-4">
              {/* 2nd Place */}
              <div className="flex flex-col items-center gap-2">
                <div className="h-12 w-12 rounded-full border-2 border-slate-600 bg-slate-800 flex items-center justify-center text-2xl">
                  {MOCK_LEADERBOARD[1].avatar}
                </div>
                <div className="flex w-20 flex-col items-center justify-end rounded-t-2xl bg-slate-800 p-2 pb-0" style={{ height: "100px" }}>
                  <span className="text-2xl font-bold text-slate-400">2</span>
                </div>
                <span className="text-xs font-bold text-slate-400">{MOCK_LEADERBOARD[1].name}</span>
                <span className="text-xs font-bold text-brand">{MOCK_LEADERBOARD[1].score}</span>
              </div>

              {/* 1st Place */}
              <div className="flex flex-col items-center gap-2 -mt-4">
                <div className="relative">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-3xl">👑</div>
                  <div className="h-16 w-16 rounded-full border-4 border-yellow-500 bg-yellow-500/20 flex items-center justify-center text-3xl shadow-lg shadow-yellow-500/50">
                    {MOCK_LEADERBOARD[0].avatar}
                  </div>
                </div>
                <div className="flex w-24 flex-col items-center justify-end rounded-t-2xl bg-gradient-to-b from-yellow-500 to-yellow-700 p-2 pb-0 shadow-lg shadow-yellow-500/20" style={{ height: "140px" }}>
                  <span className="text-4xl font-black text-white drop-shadow-md">1</span>
                </div>
                <span className="text-sm font-bold text-white">{MOCK_LEADERBOARD[0].name}</span>
                <span className="text-sm font-bold text-brand">{MOCK_LEADERBOARD[0].score}</span>
              </div>

              {/* 3rd Place */}
              <div className="flex flex-col items-center gap-2">
                <div className="h-12 w-12 rounded-full border-2 border-orange-700 bg-orange-900/50 flex items-center justify-center text-2xl">
                  {MOCK_LEADERBOARD[2].avatar}
                </div>
                <div className="flex w-20 flex-col items-center justify-end rounded-t-2xl bg-orange-900/40 p-2 pb-0" style={{ height: "80px" }}>
                  <span className="text-2xl font-bold text-orange-400">3</span>
                </div>
                <span className="text-xs font-bold text-slate-400">{MOCK_LEADERBOARD[2].name}</span>
                <span className="text-xs font-bold text-brand">{MOCK_LEADERBOARD[2].score}</span>
              </div>
            </div>

            {/* List */}
            <div className="space-y-2">
              {MOCK_LEADERBOARD.slice(3).map((user) => (
                <div key={user.id} className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 backdrop-blur-sm border border-white/5">
                  <span className="w-6 text-center text-sm font-bold text-slate-500">#{user.rank}</span>
                  <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-lg">
                    {user.avatar}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white">{user.name}</h4>
                  </div>
                  <div className="font-bold text-brand">{user.score} ball</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
