import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography
} from "@mui/material";
import { ExamTimer } from "@/components/ExamTimer";
import { useRoleStore } from "@/store/roleStore";

const MOCK_EXAM = {
  id: "exam-001",
  title: "Unit 5: Grammar Quiz",
  duration: 15,
  questions: [
    {
      id: "q1",
      text: 'Choose the correct form: "She ___ to the store yesterday."',
      type: "text",
      imageUrl: null,
      audioUrl: null,
      options: ["goes", "went", "gone", "going"],
      correctAnswer: 1
    },
    {
      id: "q2",
      text: 'What does "serene" mean?',
      type: "text",
      options: ["Quiet", "Loud", "Angry", "Fast"],
      correctAnswer: 0
    },
    {
      id: "q3",
      text: "Present Simple vs Present Continuous",
      type: "text",
      options: ["She reads", "She is reading", "She readed", "She reading"],
      correctAnswer: 1
    }
  ]
};

type AttemptAnswer = { questionId: string; selectedAnswer: number };

type Attempt = {
  examId: string;
  studentId: number;
  answers: AttemptAnswer[];
  score: number;
  submittedAt: string;
  timeSpent: number;
};

const STUDENT_ID = 7409467049;

export const ExamTaking = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const role = useRoleStore((state) => state.role);

  const [exam, setExam] = useState(MOCK_EXAM);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AttemptAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [startedAt] = useState(() => new Date());
  const [showWarning, setShowWarning] = useState(false);
  const [timeUp, setTimeUp] = useState(false);

  const currentQuestion = exam.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === exam.questions.length - 1;

  const examEndTime = useMemo(() => {
    return new Date(startedAt.getTime() + exam.duration * 60000).toISOString();
  }, [exam.duration, startedAt]);

  useEffect(() => {
    if (!examId) {
      navigate("/exams");
      return;
    }

    const existingAttempts = JSON.parse(localStorage.getItem("attempts") ?? "[]") as Attempt[];
    const hasAttempt = existingAttempts.some(
      (attempt) => attempt.examId === examId && attempt.studentId === STUDENT_ID
    );

    if (hasAttempt && role === "student") {
      alert("Siz bu imtihonni allaqachon topshirgansiz!");
      navigate("/results");
      return;
    }

    const savedExamRaw = localStorage.getItem("currentExam");
    if (savedExamRaw) {
      try {
        const savedExam = JSON.parse(savedExamRaw) as typeof MOCK_EXAM;
        setExam(savedExam);
      } catch {
        localStorage.removeItem("currentExam");
      }
    } else {
      localStorage.setItem("currentExam", JSON.stringify(MOCK_EXAM));
    }
  }, [examId, navigate, role]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (currentQuestionIndex >= 0) {
        event.preventDefault();
        event.returnValue = "Imtihonni tugatmasdan chiqmoqchimisiz?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [currentQuestionIndex]);

  useEffect(() => {
    let timeoutId: number | null = null;

    const handleVisibilityChange = () => {
      if (document.hidden && currentQuestionIndex >= 0) {
        setShowWarning(true);
        timeoutId = window.setTimeout(() => {
          if (document.hidden) {
            handleSubmit();
          }
        }, 10000);
      } else {
        setShowWarning(false);
        if (timeoutId) {
          window.clearTimeout(timeoutId);
          timeoutId = null;
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [currentQuestionIndex]);

  useEffect(() => {
    const answer = answers[currentQuestionIndex];
    setSelectedAnswer(answer?.selectedAnswer ?? null);
  }, [answers, currentQuestionIndex]);

  const persistAnswer = (index: number, answerIndex: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = { questionId: exam.questions[index].id, selectedAnswer: answerIndex };
      return next;
    });
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    persistAnswer(currentQuestionIndex, answerIndex);
  };

  const scoreAttempt = (answerList: AttemptAnswer[]) => {
    const correct = answerList.reduce((total, answer) => {
      const question = exam.questions.find((q) => q.id === answer.questionId);
      return question && question.correctAnswer === answer.selectedAnswer ? total + 1 : total;
    }, 0);
    return Math.round((correct / exam.questions.length) * 100);
  };

  const handleSubmit = () => {
    const attemptAnswers =
      selectedAnswer !== null && !answers[currentQuestionIndex]
        ? [
            ...answers,
            { questionId: currentQuestion.id, selectedAnswer: selectedAnswer }
          ]
        : answers;

    const attempt: Attempt = {
      examId: exam.id,
      studentId: STUDENT_ID,
      answers: attemptAnswers,
      score: scoreAttempt(attemptAnswers),
      submittedAt: new Date().toISOString(),
      timeSpent: Math.floor((Date.now() - startedAt.getTime()) / 1000)
    };

    const existingAttempts = JSON.parse(localStorage.getItem("attempts") ?? "[]") as Attempt[];
    existingAttempts.push(attempt);
    localStorage.setItem("attempts", JSON.stringify(existingAttempts));
    localStorage.setItem("lastExam", JSON.stringify(exam));
    localStorage.removeItem("currentExam");

    navigate("/results", { state: { attempt } });
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    if (isLastQuestion) {
      handleSubmit();
      return;
    }

    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex === 0) return;
    setCurrentQuestionIndex((prev) => prev - 1);
  };

  const handleBack = () => {
    if (window.confirm("Imtihonni tugatmasdan chiqmoqchimisiz?")) {
      navigate(-1);
    }
  };

  const handleTimeOut = () => {
    setTimeUp(true);
    handleSubmit();
  };

  if (timeUp) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Vaqt tugadi! Imtihon avtomatik tarzda topshirildi.
        </Alert>
        <Button variant="contained" onClick={() => navigate("/results")} sx={{ bgcolor: "#FF5F00" }}>
          Natijalarni ko'rish
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", pb: 8 }}>
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid #E5E7EB",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "#FFFFFF"
        }}
      >
        <Button onClick={handleBack} sx={{ color: "#6B7280" }} startIcon={<span>&lt;</span>}>
          Orqaga
        </Button>

        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          Savol {currentQuestionIndex + 1}/{exam.questions.length}
        </Typography>

        <ExamTimer endTimeISO={examEndTime} onTimeout={handleTimeOut} />
      </Box>

      {showWarning ? (
        <Alert
          severity="warning"
          sx={{
            m: 2,
            position: "fixed",
            top: 64,
            left: 16,
            right: 16,
            zIndex: 1200
          }}
          onClose={() => setShowWarning(false)}
        >
          ⚠️ Tabni yoping! 10 soniya ichida qaytmasangiz, imtihon avtomatik tarzda topshiriladi.
        </Alert>
      ) : null}

      <Box sx={{ flex: 1, p: 3, overflowY: "auto" }}>
        <Typography variant="h5" sx={{ mb: 3, lineHeight: 1.4 }}>
          {currentQuestion.text}
        </Typography>

        {currentQuestion.imageUrl ? (
          <Box
            sx={{
              width: "100%",
              height: 200,
              bgcolor: "#F3F4F6",
              borderRadius: 2,
              mb: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px dashed #E5E7EB"
            }}
          >
            <Typography variant="body2" color="textSecondary">
              Rasm yuklanmoqda...
            </Typography>
          </Box>
        ) : null}

        {currentQuestion.audioUrl ? (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ color: "#FF5F00" }}>
              🔊 Audio savol (yakunlanmagan)
            </Typography>
          </Box>
        ) : null}

        <RadioGroup
          value={selectedAnswer}
          onChange={(event) => handleAnswerSelect(Number(event.target.value))}
        >
          {currentQuestion.options.map((option, index) => (
            <FormControlLabel
              key={index}
              value={index}
              control={
                <Radio
                  sx={{
                    color: "#E5E7EB",
                    "&.Mui-checked": { color: "#FF5F00" }
                  }}
                />
              }
              label={
                <Box
                  sx={{
                    flex: 1,
                    p: 2,
                    border: selectedAnswer === index ? "2px solid #FF5F00" : "2px solid #E5E7EB",
                    borderRadius: 2,
                    bgcolor: selectedAnswer === index ? "rgba(255,95,0,0.08)" : "#FFFFFF"
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {String.fromCharCode(65 + index)}. {option}
                  </Typography>
                </Box>
              }
              sx={{ mb: 2, width: "100%", ml: 0, "& .MuiFormControlLabel-label": { width: "100%" } }}
            />
          ))}
        </RadioGroup>
      </Box>

      <Box
        sx={{
          p: 2,
          borderTop: "1px solid #E5E7EB",
          display: "flex",
          gap: 2,
          bgcolor: "#FFFFFF"
        }}
      >
        <Button
          variant="outlined"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          sx={{
            flex: 1,
            borderColor: "#FF5F00",
            color: "#FF5F00",
            py: 1.5,
            fontWeight: 600,
            "&:disabled": { borderColor: "#E5E7EB", color: "#9CA3AF" }
          }}
        >
          Oldingi
        </Button>

        <Button
          variant="contained"
          onClick={handleNext}
          disabled={selectedAnswer === null}
          sx={{
            flex: 1,
            bgcolor: "#FF5F00",
            py: 1.5,
            fontWeight: 600,
            "&:hover": { bgcolor: "#E05500" },
            "&:disabled": { bgcolor: "#E5E7EB", color: "#9CA3AF" }
          }}
        >
          {isLastQuestion ? "Imtihonni Tugatish" : "Keyingi"}
        </Button>
      </Box>
    </Box>
  );
};
