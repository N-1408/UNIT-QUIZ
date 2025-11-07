import { Router } from "express";
import { getExamWithQuestions, listExams, type ExamSummaryRecord } from "../supabaseService.js";

const router = Router();

const deriveStatus = (exam: { is_published: boolean | null }): "upcoming" | "open" | "closed" =>
  exam.is_published ? "open" : "upcoming";

const mapSummary = (exam: ExamSummaryRecord) => ({
  id: exam.id,
  title: exam.title,
  description: exam.description,
  durationMin: exam.duration_min,
  attemptsLimit: exam.attempts_limit,
  startsAt: exam.created_at,
  endsAt: null,
  status: deriveStatus(exam)
});

router.get("/exams", async (_req, res) => {
  const result = await listExams();

  if (!result.success) {
    return res.status(500).json({ success: false, data: null, error: result.message ?? "internal_error" });
  }

  const payload = (result.data ?? []).map(mapSummary);
  return res.json({ success: true, data: payload, error: null });
});

router.get("/exams/:examId", async (req, res) => {
  const examId = Number(req.params.examId);

  if (!Number.isFinite(examId)) {
    return res.status(400).json({ success: false, data: null, error: "invalid_exam_id" });
  }

  const result = await getExamWithQuestions(examId);

  if (!result.success) {
    return res.status(500).json({ success: false, data: null, error: result.message ?? "internal_error" });
  }

  if (!result.data) {
    return res.status(404).json({ success: false, data: null, error: "exam_not_found" });
  }

  const exam = result.data;
  const payload = {
    ...mapSummary({
      id: exam.id,
      title: exam.title,
      description: exam.description,
      duration_min: exam.duration_min,
      attempts_limit: exam.attempts_limit,
      review_policy: exam.review_policy,
      pass_min_correct: exam.pass_min_correct,
      is_published: exam.is_published,
      created_at: exam.created_at
    }),
    reviewPolicy: exam.review_policy,
    passMinCorrect: exam.pass_min_correct,
    shuffleQuestions: exam.shuffle_questions,
    shuffleAnswers: exam.shuffle_answers,
    backNavLock: exam.back_nav_lock,
    questions: exam.questions.map((question) => ({
      id: question.id,
      examId: question.exam_id,
      type: question.type,
      text: question.text,
      points: question.points,
      explanation: question.explanation,
      options: question.options.map((option) => ({
        id: option.id,
        questionId: option.question_id,
        text: option.text,
        isCorrect: option.is_correct,
        ord: option.ord
      }))
    }))
  };

  return res.json({ success: true, data: payload, error: null });
});

export default router;

