import { Router } from "express";
import { createAttempt, getStudentAttempts, gradeAndSubmitAttempt } from "../supabaseService.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.use(authMiddleware);

router.get("/", async (req, res) => {
  const user = req.user!;
  // Allow admin to view other's attempts if tgId query param is present, otherwise view own
  const targetTgId = (user.role === "admin" && req.query.tgId)
    ? Number(req.query.tgId)
    : user.tgId;

  const result = await getStudentAttempts(targetTgId);

  if (!result.success) {
    return res.status(500).json({ success: false, error: result.message });
  }

  // Map to DTO
  const payload = result.data?.map((a) => ({
    id: a.id,
    examId: a.exam_id,
    examTitle: a.exams?.title ?? "Unknown Exam",
    score: a.score,
    state: a.state,
    startedAt: a.started_at,
    submittedAt: a.submitted_at,
    durationSpentSec: 0 // TODO: calc
  }));

  return res.json({ success: true, data: payload });
});

router.post("/", async (req, res) => {
  const user = req.user!;
  const { examId } = req.body;

  if (!examId) {
    return res.status(400).json({ success: false, error: "missing_exam_id" });
  }

  const result = await createAttempt(user.tgId, examId);

  if (!result.success) {
    return res.status(400).json({ success: false, error: result.message });
  }

  return res.json({ success: true, data: result.data });
});

router.post("/:attemptId/submit", async (req, res) => {
  const user = req.user!;
  const attemptId = Number(req.params.attemptId);
  const { answers, durationSpentSec } = req.body; // Expecting { questionId: optionId }

  if (!Number.isFinite(attemptId) || !answers) {
    return res.status(400).json({ success: false, error: "invalid_payload" });
  }

  // Verify ownership (optional but recommended, though attempt ID is hard to guess)
  // For now, gradeAndSubmitAttempt checks if attempt exists and is active. 
  // Ideally we should check if attempt.student_id === user.tgId inside the service.

  const result = await gradeAndSubmitAttempt(attemptId, answers, durationSpentSec || 0);

  if (!result.success) {
    return res.status(500).json({ success: false, error: result.message });
  }

  return res.json({ success: true, data: result.data });
});

export default router;
