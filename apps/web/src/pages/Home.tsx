import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WordSpark } from "@/components/dashboard/WordSpark";
import { apiClient } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { initializeTelegram } from "@/lib/telegram";
import { useRoleStore } from "@/store/roleStore";
import { Play, Trophy, Clock, BookOpen, ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeTelegram();
        const userRes = await apiClient.getCurrentUser();
        if (userRes.success && userRes.data) {
          setRole(userRes.data.role as "student" | "admin");
          setUserName(userRes.data.firstName || "Student");
        }

        const webApp = (window as any).Telegram?.WebApp;
        if (webApp) webApp.ready();

        const attemptsRes = await apiClient.getAttempts(0);
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

        const user = webApp?.initDataUnsafe?.user;
        if (user) setUserName(user.first_name);

        setLoading(false);
      } catch (error) {
        console.error("Failed to initialize:", error);
        setLoading(false);
      }
    };

    init();
  }, []);

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-foreground">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 font-sans transition-colors duration-300">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium mb-1">Welcome back 👋</p>
          <h1 className="text-3xl font-bold">{userName}</h1>
        </div>
        <div className="w-12 h-12 rounded-full bg-secondary/50 backdrop-blur-md border border-border flex items-center justify-center text-xl shadow-sm">
          👨‍🎓
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Average Score Button (Main Feature) */}
        <button
          onClick={() => setShowStats(!showStats)}
          className="w-full relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-500 to-red-600 p-6 text-white shadow-xl shadow-orange-500/20 transition-transform active:scale-95"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="text-left">
              <div className="flex items-center gap-2 text-orange-100 mb-2">
                <Trophy className="w-5 h-5" />
                <span className="font-medium">Average Score</span>
              </div>
              <div className="text-5xl font-bold tracking-tight">{stats.averageScore}%</div>
              <p className="text-orange-100 text-sm mt-1">Based on {stats.totalExams} exams</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
              <ChevronRight className="w-8 h-8 text-white" />
            </div>
          </div>
        </button>

        {/* Stats Modal / Expandable (Inline for now) */}
        {showStats && (
          <div className="animate-in fade-in slide-in-from-top-4 bg-card border border-border rounded-2xl p-6 shadow-lg">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Performance Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary/50 p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-primary">{stats.totalExams}</div>
                <div className="text-xs text-muted-foreground">Exams Taken</div>
              </div>
              <div className="bg-secondary/50 p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-green-500">Top 10%</div>
                <div className="text-xs text-muted-foreground">Ranking</div>
              </div>
            </div>
          </div>
        )}

        {/* Word Spark */}
        <WordSpark />

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-32 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-secondary/50 transition-all"
            onClick={() => navigate("/exams")}
          >
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Play className="w-6 h-6 fill-current" />
            </div>
            <span className="font-semibold">Start Exam</span>
          </Button>

          <Button
            variant="outline"
            className="h-32 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-secondary/50 transition-all"
            onClick={() => navigate("/results")} // Or a dedicated "Completed" page
          >
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
              <Clock className="w-6 h-6" />
            </div>
            <span className="font-semibold">History</span>
          </Button>
        </div>

        {/* Recent Activity List (Replacing Results Page mostly) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Completed Exams
            </h3>
            <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => navigate("/results")}>
              View All
            </Button>
          </div>

          {stats.totalExams > 0 ? (
            <div className="space-y-3">
              <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-bold text-white",
                      stats.lastExamScore >= 80 ? "bg-green-500" : stats.lastExamScore >= 50 ? "bg-yellow-500" : "bg-red-500"
                    )}>
                      {stats.lastExamScore}
                    </div>
                    <div>
                      <h4 className="font-medium">{stats.lastExamTitle}</h4>
                      <p className="text-xs text-muted-foreground">Just now</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center p-8 rounded-2xl border border-dashed border-border bg-secondary/20">
              <p className="text-muted-foreground text-sm">No completed exams yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
