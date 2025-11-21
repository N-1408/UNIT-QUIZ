import { Router } from "express";
import { getExamWithQuestions, listExams, createExam, createQuestion, type ExamRecord } from "../supabaseService.js";

const router = Router();

const deriveStatus = (exam: { is_published: boolean | null; start_time: string | null; end_time: string | null }): "upcoming" | "open" | "closed" => {
  if (!exam.is_published) return "upcoming";

  const now = new Date();
  if (exam.start_time && now < new Date(exam.start_time)) return "upcoming";
  if (exam.end_time && now > new Date(exam.end_time)) return "closed";

  return "open";
};

const mapSummary = (exam: ExamRecord) => ({
  id: exam.id,
  title: exam.title,
  description: exam.description,
  durationMin: exam.duration_min,
  attemptsLimit: exam.attempts_limit,
  startsAt: exam.start_time ?? exam.created_at,
  endsAt: exam.end_time,
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

  // SECURITY: Do NOT expose is_correct to the client!
  const payload = {
    ...mapSummary(exam),
    reviewPolicy: exam.review_policy,
    passMinCorrect: exam.pass_min_correct,
    shuffleQuestions: exam.shuffle_questions,
    shuffleAnswers: exam.shuffle_answers,
    backNavLock: false, // TODO: Add to schema if needed
    questions: exam.questions.map((question) => ({
      id: question.id,
      examId: question.exam_id,
      type: question.type,
      text: question.text,
      points: question.points,
      explanation: null, // Hide explanation until review
      imageUrl: question.image_url,
      audioUrl: question.audio_url,
      options: question.options.map((option) => ({
        id: option.id,
        questionId: option.question_id,
        text: option.text,
        // isCorrect is INTENTIONALLY OMITTED
        ord: option.ord
      }))
    }))
  };

  return res.json({ success: true, data: payload, error: null });
});

router.post("/exams", async (req, res) => {
  // TODO: Real auth check
  const { title, description, durationMin, startTime, endTime } = req.body;
  const ownerId = 1472746219; // Hardcoded admin for now

  if (!title || !durationMin) {
    return res.status(400).json({ success: false, error: "missing_fields" });
  }

  const result = await createExam(ownerId, title, description, durationMin, startTime, endTime);

  if (!result.success) {
    return res.status(500).json({ success: false, error: result.message });
  }

  return res.json({ success: true, data: result.data });
});

router.post("/exams/:examId/questions", async (req, res) => {
  const examId = Number(req.params.examId);
  const { text, type, points, options } = req.body;

  if (!Number.isFinite(examId) || !text || !options || !Array.isArray(options)) {
    return res.status(400).json({ success: false, error: "invalid_payload" });
  }

  // TODO: Check ownership

  const result = await createQuestion(examId, text, type ?? "single_choice", points ?? 1, options);

  if (!result.success) {
    return res.status(500).json({ success: false, error: result.message });
  }

  return res.json({ success: true, data: result.data });
});

export default router;

