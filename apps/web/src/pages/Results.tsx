import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Card, CardContent, CircularProgress, Typography } from "@mui/material";
import { calculateScore } from "@/lib/calculateScore";
import { ResultsBreakdown } from "@/components/ResultsBreakdown";
import { useRoleStore } from "@/store/roleStore";

type AttemptRecord = {
  examId: string;
  studentId: number;
  answers: Array<{ questionId: string; selectedAnswer: number }>;
  score: number;
  submittedAt: string;
  timeSpent: number;
};

type ExamRecord = {
  id: string;
  title: string;
  questions: Array<{ id: string; text: string; options: string[]; correctAnswer: number }>;
};

export const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const role = useRoleStore((state) => state.role);

  const [attempt, setAttempt] = useState<AttemptRecord | null>(null);
  const [exam, setExam] = useState<ExamRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stateAttempt = location.state?.attempt as AttemptRecord | undefined;
    const attempts = JSON.parse(localStorage.getItem("attempts") ?? "[]") as AttemptRecord[];
    const storedExam =
      localStorage.getItem("lastExam") ?? localStorage.getItem("currentExam");

    if (stateAttempt) {
      setAttempt(stateAttempt);
    } else if (attempts.length > 0) {
      setAttempt(attempts[attempts.length - 1]);
    }

    if (storedExam) {
      try {
        setExam(JSON.parse(storedExam) as ExamRecord);
      } catch {
        localStorage.removeItem("lastExam");
      }
    }

    setLoading(false);
  }, [location.state]);

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6">Natijalar yuklanmoqda...</Typography>
      </Box>
    );
  }

  if (!attempt || !exam) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Hali natijalar yo'q
        </Typography>
        <Typography variant="body2" sx={{ color: "#6B7280" }}>
          Iltimos, birinchi bo'lib imtihon topshiring yoki mavjud natijalarni qayta yuklang.
        </Typography>
      </Box>
    );
  }

  const scoreData = calculateScore(exam.questions, attempt.answers);

  const handleReviewMistakes = () => {
    const mistakes = scoreData.breakdown.filter((entry) => !entry.isCorrect && !entry.isSkipped).length;
    alert(`${mistakes} ta xatolikni qayta ko'rib chiqing!`);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#FFFFFF", pb: 8 }}>
      <Card
        sx={{
          m: 2,
          borderRadius: 3,
          color: "#FFFFFF",
          background: "linear-gradient(135deg, #FF5F00 0%, #E05500 100%)",
          boxShadow: "0 8px 24px rgba(255, 95, 0, 0.3)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <CardContent sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            {exam.title}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
            Jo'natilgan: {new Date(attempt.submittedAt).toLocaleString()}
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <Box sx={{ position: "relative", display: "inline-flex" }}>
              <CircularProgress
                variant="determinate"
                value={scoreData.score}
                size={110}
                thickness={4.5}
                sx={{
                  color: "#FFFFFF",
                  "& .MuiCircularProgress-circle": { strokeLinecap: "round" }
                }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {scoreData.score}%
                  </Typography>
                  <Typography variant="caption">
                    {scoreData.correctCount}/{scoreData.total}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {(role === "teacher" || role === "admin") && (
            <Card
              sx={{
                mt: 3,
                borderRadius: 2,
                bgcolor: "rgba(255,255,255,0.2)",
                border: "1px solid rgba(255,255,255,0.3)"
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Class Average: 78.5%
                </Typography>
                <Typography variant="caption">24/30 students completed</Typography>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography variant="h6" sx={{ color: "#FF5F00", fontWeight: 700 }}>
          #3 out of 50 students
        </Typography>
        <Typography variant="body2" sx={{ color: "#6B7280" }}>
          Excellent job! Top 10% of your class
        </Typography>
      </Box>

      <ResultsBreakdown
        breakdown={scoreData.breakdown}
        questions={exam.questions}
        onReviewMistakes={handleReviewMistakes}
      />

      <Box sx={{ p: 2, display: "flex", gap: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => navigate("/exams")}
          sx={{ color: "#FF5F00", borderColor: "#FF5F00", py: 1.5, fontWeight: 600 }}
        >
          Boshqa imtihonlar
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={() => navigate("/exam/exam-001")}
          sx={{ bgcolor: "#FF5F00", py: 1.5, fontWeight: 600 }}
        >
          Qayta boshlash
        </Button>
      </Box>
    </Box>
  );
};
