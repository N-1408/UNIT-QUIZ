import { Router } from "express";

const router = Router();

router.post("/", (req, res) => {
  console.log("[REMOTE LOG]", req.body?.tag, req.body?.data);
  res.json({ ok: true });
});

export default router;
