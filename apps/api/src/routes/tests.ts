import { Router } from 'express';

const router = Router();

router.get('/tests', (_req, res) => {
  res.json([
    {
      id: 1,
      title: 'Unit 1 Quick Check',
      duration_sec: 600
    }
  ]);
});

router.post('/submissions', (_req, res) => {
  res.json({ ok: true, mock: true });
});

export default router;
