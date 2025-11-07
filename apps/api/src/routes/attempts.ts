import { Router } from "express";
import { getStudentAttempts, submitAttempt } from "../supabaseService.js";

const router = Router();

const mapAttempt = (attempt: {
  id: number;
  exam_id: number;
  exams?: { title: string | null };
  score: number | null;
  state: string;
  started_at: string | null;
  submitted_at: string | null;
  duration_spent_sec: number | null;
}) => ({
  id: attempt.id,
  examId: attempt.exam_id,
  examTitle: attempt.exams?.title ?? null,
  score: attempt.score,
  state: attempt.state,
  startedAt: attempt.started_at,
  submittedAt: attempt.submitted_at,
  durationSpentSec: attempt.duration_spent_sec
});

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

router.post("/attempts/:attemptId/submit", async (req, res) => {
  const attemptId = Number(req.params.attemptId);

  if (!Number.isFinite(attemptId)) {
    return res.status(400).json({ success: false, data: null, error: "invalid_attempt_id" });
  }

  const { score = null, durationSpentSec = null } = req.body ?? {};

  const result = await submitAttempt(attemptId, score, durationSpentSec);

  if (!result.success || !result.data) {
    return res.status(500).json({ success: false, data: null, error: result.message ?? "internal_error" });
  }

  return res.json({ success: true, data: mapAttempt(result.data), error: null });
});

export default router;

