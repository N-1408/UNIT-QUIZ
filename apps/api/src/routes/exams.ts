import { Router } from "express";
import { getExamWithQuestions, listExams, createExam, createQuestion, type ExamRecord } from "../supabaseService.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// Public endpoint (no auth needed for listing summaries, but maybe we want to restrict?)
// For now, let's keep listing public or optional auth if we want to show "taken" status
router.get("/exams", async (req, res) => {
  const result = await listExams();
  if (!result.success) {
    return res.status(500).json({ success: false, error: result.message });
  }

  // Map to DTO
  const payload = result.data?.map((e) => {
    const { status, startTime, endTime } = deriveStatus(e);
    return {
      id: e.id,
      title: e.title,
      description: e.description,
      durationMin: e.duration_min,
      attemptsLimit: 1, // TODO: Add to DB
      startsAt: startTime ? startTime.toISOString() : null,
      endsAt: endTime ? endTime.toISOString() : null,
      status
    };
  });

  return res.json({ success: true, data: payload });
});

// Protected endpoints
router.use(authMiddleware);

router.get("/exams/:examId", async (req, res) => {
  const examId = Number(req.params.examId);
  if (!Number.isFinite(examId)) {
    return res.status(400).json({ success: false, error: "invalid_id" });
  }

  const result = await getExamWithQuestions(examId);
  if (!result.success || !result.data) {
    return res.status(404).json({ success: false, error: "exam_not_found" });
  }

  const exam = result.data;
  const { status, startTime, endTime } = deriveStatus(exam);

  // Security: Remove is_correct and explanation
  const safeQuestions = exam.questions.map((q) => ({
    id: q.id,
    examId: q.exam_id,
    type: q.type,
    text: q.text,
    points: q.points,
    explanation: null, // Hide explanation
    imageUrl: q.image_url,
    audioUrl: q.audio_url,
    options: q.options.map((o) => ({
      id: o.id,
      questionId: o.question_id,
      text: o.text,
      ord: o.ord
      // isCorrect is REMOVED
    }))
  }));

  const payload = {
    id: exam.id,
    title: exam.title,
    description: exam.description,
    durationMin: exam.duration_min,
    attemptsLimit: 1,
    startsAt: startTime ? startTime.toISOString() : null,
    endsAt: endTime ? endTime.toISOString() : null,
    status,
    reviewPolicy: "immediate", // TODO: DB field
    passMinCorrect: 50, // TODO: DB field
    shuffleQuestions: false,
    shuffleAnswers: false,
    backNavLock: false,
    questions: safeQuestions
  };

  return res.json({ success: true, data: payload, error: null });
});

router.post("/exams", async (req, res) => {
  const user = req.user!;

  if (user.role !== "admin") {
    return res.status(403).json({ success: false, error: "forbidden" });
  }

  const { title, description, durationMin, startTime, endTime } = req.body;

  if (!title || !durationMin) {
    return res.status(400).json({ success: false, error: "missing_fields" });
  }

  const result = await createExam(user.tgId, title, description, durationMin, startTime, endTime);

  if (!result.success) {
    return res.status(500).json({ success: false, error: result.message });
  }

  return res.json({ success: true, data: result.data });
});

router.post("/exams/:examId/questions", async (req, res) => {
  const user = req.user!;

  if (user.role !== "admin") {
    return res.status(403).json({ success: false, error: "forbidden" });
  }

  const examId = Number(req.params.examId);
  const { text, type, points, options } = req.body;

  if (!Number.isFinite(examId) || !text || !options || !Array.isArray(options)) {
    return res.status(400).json({ success: false, error: "invalid_payload" });
  }

  const result = await createQuestion(examId, text, type ?? "single_choice", points ?? 1, options);

  if (!result.success) {
    return res.status(500).json({ success: false, error: result.message });
  }

  return res.json({ success: true, data: result.data });
});

function deriveStatus(exam: ExamRecord) {
  const now = new Date();
  const startTime = exam.start_time ? new Date(exam.start_time) : null;
  const endTime = exam.end_time ? new Date(exam.end_time) : null;

  let status: "upcoming" | "open" | "closed" = "open";

  if (!exam.is_published) {
    status = "upcoming";
  } else if (startTime && now < startTime) {
    status = "upcoming";
  } else if (endTime && now > endTime) {
    status = "closed";
  }

  return { status, startTime, endTime };
}

export default router;
