import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { initializeTelegram } from "@/lib/telegram";
import { useRoleStore } from "@/store/roleStore";
import { Play, Trophy, Clock, TrendingUp, BookOpen } from "lucide-react";

export const HomePage = () => {
  const navigate = useNavigate();
  const setRole = useRoleStore((state) => state.setRole);
  const [userName, setUserName] = useState("Student");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalExams: 0,
    averageScore: 0,
    lastExamTitle: "",
    lastExamScore: 0,
  });

  useEffect(() => {
    const init = async () => {
      // 1. Init Telegram User
      try {
        await initializeTelegram();

        // 2. Fetch current user profile to get role
        const userRes = await apiClient.getCurrentUser();
        if (userRes.success && userRes.data) {
          setRole(userRes.data.role as "student" | "admin");
          setUserName(userRes.data.firstName || "Student");
        }

        // 3. Sync user with backend
        const webApp = (window as any).Telegram?.WebApp;
        if (webApp) {
          webApp.ready();
        }

        // 4. Fetch user stats
        const attemptsRes = await apiClient.getAttempts(0); // 0 or any ID is ignored by backend if not admin
        if (attemptsRes.success && attemptsRes.data) {
          const submitted = attemptsRes.data.filter((a) => a.state === "submitted" || a.state === "graded");
          const total = submitted.length;
          const avg = total > 0
            ? Math.round(submitted.reduce((acc, a) => acc + (a.score || 0), 0) / total)
            : 0;
          const last = submitted.length > 0 ? submitted[submitted.length - 1] : null;

          setStats({
            totalExams: total,
            averageScore: avg,
            lastExamTitle: last?.examTitle || "N/A",
            lastExamScore: last?.score || 0,
          });
        }

        // Get user info from WebApp
        const user = webApp?.initDataUnsafe?.user;
        if (user) {
          setUserName(user.first_name);
        } else {
          setUserName("Mehmon");
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to initialize Telegram or fetch data:", error);
        setLoading(false); // Ensure loading state is cleared even on error
      }
    };

    init();
  }, []);

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-white">Yuklanmoqda...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 pb-24 font-sans">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-b-[3rem] bg-gradient-to-br from-orange-600 to-orange-800 px-6 pt-12 pb-16 shadow-2xl shadow-orange-900/50">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

        <div className="relative z-10 flex items-center justify-between mb-6">
          <div>
            <p className="text-orange-200 text-sm font-medium mb-1">Xush kelibsiz 👋</p>
            <h1 className="text-3xl font-bold text-white">{userName}</h1>
          </div>
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-xl">
            👨‍🎓
          </div>
        </div>

        {/* Main Stats Card */}
        <div className="relative z-10 grid grid-cols-2 gap-4">
          <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 text-orange-200 mb-2">
              <Trophy className="w-4 h-4" />
              <span className="text-xs font-medium">O'rtacha Ball</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.averageScore}%</p>
          </div>
          <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 text-orange-200 mb-2">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs font-medium">Topshirildi</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.totalExams} ta</p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-8 relative z-20 space-y-6">
        {/* Quick Action */}
        <Button
          className="w-full h-16 text-lg shadow-xl shadow-orange-500/30 rounded-2xl flex items-center justify-between px-6"
          onClick={() => navigate("/exams")}
        >
          <span className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Play className="w-4 h-4 fill-current" />
            </div>
            Imtihon Topshirish
          </span>
          <span className="opacity-60">→</span>
        </Button>

        {/* Recent Activity */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            So'nggi Faoliyat
          </h3>

          {stats.totalExams > 0 ? (
            <Card className="bg-white/5 border-white/10 backdrop-blur-md">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white mb-1">{stats.lastExamTitle}</h4>
                  <p className="text-sm text-slate-400">Natija: {stats.lastExamScore}%</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate("/results")}>
                  Ko'rish
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center p-8 rounded-2xl border border-dashed border-white/10 bg-white/5">
              <p className="text-slate-400 text-sm">Hali hech qanday imtihon topshirmadingiz.</p>
            </div>
          )}
        </div>

        {/* Weekly Progress (Mock for visual) */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Haftalik O'sish
          </h3>
          <div className="grid grid-cols-7 gap-2 h-24 items-end p-4 rounded-2xl bg-white/5 border border-white/10">
            {[40, 65, 30, 85, 50, 90, 75].map((h, i) => (
              <div key={i} className="w-full bg-white/10 rounded-t-lg relative group">
                <div
                  className="absolute bottom-0 w-full bg-orange-500/50 rounded-t-lg transition-all group-hover:bg-orange-500"
                  style={{ height: `${h}%` }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
