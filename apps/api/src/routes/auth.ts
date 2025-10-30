import { Router } from 'express';

const router = Router();

router.post('/auth/telegram', (_req, res) => {
  res.json({
    ok: true,
    user: {
      tg_id: '123456789',
      fullName: 'Mock Talaba'
    }
  });
});

router.post('/teacher/login', (req, res) => {
  const { password } = req.body ?? {};
  if (password === 'NKN09') {
    return res.json({ ok: true });
  }
  res.json({ ok: false, error: 'Invalid password' });
});

export default router;
