import { Router } from "express";
import { getStudentAttempts, gradeAndSubmitAttempt, createAttempt } from "../supabaseService.js";

const router = Router();

type SupabaseAttemptRow = {
  id: number;
  exam_id: number;
  exams?: { title: string | null; duration_min: number | null } | null;
  score: number | null;
  state: string;
  started_at: string | null;
  submitted_at: string | null;
  duration_spent_sec: number | null;
};

const mapAttempt = (attempt: SupabaseAttemptRow) => {
  return {
    id: attempt.id,
    examId: attempt.exam_id,
    examTitle: attempt.exams?.title ?? null,
    score: attempt.score,
    state: attempt.state,
    startedAt: attempt.started_at,
    submittedAt: attempt.submitted_at,
    durationSpentSec: attempt.duration_spent_sec
  };
};

router.get("/attempts", async (req, res) => {
  const tgIdParam = req.query.tgId;

  if (!tgIdParam) {
    return res.status(400).json({ success: false, data: null, error: "missing_tg_id" });
  }

  const numericId = Number(String(tgIdParam));
  if (!Number.isFinite(numericId)) {
    return res.status(400).json({ success: false, data: null, error: "invalid_tg_id" });
  }

  const result = await getStudentAttempts(numericId);

  if (!result.success) {
    return res.status(500).json({ success: false, data: null, error: result.message ?? "internal_error" });
  }

  const payload = (result.data ?? []).map(mapAttempt);
  return res.json({ success: true, data: payload, error: null });
});

router.post("/attempts", async (req, res) => {
  const { examId, studentTgId } = req.body;

  if (!examId || !studentTgId) {
    return res.status(400).json({ success: false, data: null, error: "missing_params" });
  }

  const result = await createAttempt(Number(studentTgId), Number(examId));

  if (!result.success || !result.data) {
    return res.status(400).json({ success: false, data: null, error: result.message ?? "creation_failed" });
  }

  return res.json({ success: true, data: mapAttempt(result.data as any), error: null });
});

router.post("/attempts/:attemptId/submit", async (req, res) => {
  const attemptId = Number(req.params.attemptId);

  if (!Number.isFinite(attemptId)) {
    return res.status(400).json({ success: false, data: null, error: "invalid_attempt_id" });
  }

  // Expect answers: { [questionId: number]: optionId }
  const { answers = {}, durationSpentSec = 0 } = req.body ?? {};

  const result = await gradeAndSubmitAttempt(attemptId, answers, durationSpentSec);

  if (!result.success || !result.data) {
    return res.status(500).json({ success: false, data: null, error: result.message ?? "internal_error" });
  }

  return res.json({ success: true, data: mapAttempt(result.data), error: null });
});

export default router;
