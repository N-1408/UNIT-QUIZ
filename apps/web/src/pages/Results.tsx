import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/apiClient";
import type { AttemptSummaryDto } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, Trophy } from "lucide-react";

export const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState<AttemptSummaryDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      // 1. Try to get attempt from navigation state
      if (location.state?.attempt) {
        setAttempt(location.state.attempt);
        setLoading(false);
        return;
      }

      // 2. Fallback: Fetch last attempt from API
      // Hardcoded student ID for prototype
      const STUDENT_ID = 7409467049;
      const res = await apiClient.getAttempts(STUDENT_ID);

      if (res.success && res.data && res.data.length > 0) {
        // Get the most recent submitted attempt
        const lastSubmitted = res.data.find(a => a.state === "submitted" || a.state === "graded");
        if (lastSubmitted) {
          setAttempt(lastSubmitted);
        }
      }
      setLoading(false);
    };

    init();
  }, [location.state]);

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
  const isPass = score >= 60; // TODO: Get pass mark from exam details

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-4 pb-24 font-sans">
      <div className="max-w-md mx-auto space-y-6">

        {/* Score Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 to-orange-700 p-8 text-center shadow-2xl shadow-orange-500/20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

          <h1 className="relative text-3xl font-bold text-white mb-2">{attempt.examTitle ?? "Imtihon Natijasi"}</h1>
          <p className="relative text-orange-100 mb-8 opacity-90">
            Topshirildi: {new Date(attempt.submittedAt!).toLocaleString()}
          </p>

          <div className="relative inline-flex items-center justify-center w-40 h-40 rounded-full bg-white/10 backdrop-blur-md border-4 border-white/20 mb-6 shadow-inner">
            <div className="text-center">
              <span className="block text-5xl font-black text-white">{score}%</span>
              <span className="text-sm font-medium text-orange-100 uppercase tracking-wider">Natija</span>
            </div>
          </div>

          <div className="relative flex justify-center gap-4">
            <div className="flex items-center gap-2 bg-black/20 rounded-full px-4 py-2 backdrop-blur-sm">
              <Clock className="w-4 h-4 text-orange-200" />
              <span className="text-sm font-medium">{Math.floor((attempt.durationSpentSec ?? 0) / 60)} daqiqa</span>
            </div>
            <div className="flex items-center gap-2 bg-black/20 rounded-full px-4 py-2 backdrop-blur-sm">
              {isPass ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
              <span className="text-sm font-medium">{isPass ? "O'tdi" : "Yiqildi"}</span>
            </div>
          </div>
        </div>

        {/* Stats / Details */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">#3</div>
              <div className="text-xs text-slate-400">Reyting (Sinov)</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">Top 10%</div>
              <div className="text-xs text-slate-400">Sinfdagi o'rni</div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-4">
          <Button
            className="w-full bg-white text-slate-900 hover:bg-slate-100"
            onClick={() => navigate("/exams")}
          >
            Boshqa imtihonlar
          </Button>

          {/* Only show retry if allowed (logic to be added) */}
          <Button
            variant="outline"
            className="w-full border-white/10 text-slate-400 hover:bg-white/5 hover:text-white"
            onClick={() => navigate(`/exam/${attempt.examId}`)}
          >
            Qayta topshirish
          </Button>
        </div>

      </div>
    </div>
  );
};
