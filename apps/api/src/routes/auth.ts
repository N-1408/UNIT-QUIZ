import { Router } from 'express';

const router = Router();

router.post('/telegram', (_req, res) => {
  res.json({
    ok: true,
    mock: true,
    message: 'InitData verification stub. Integratsiya keyin yoziladi.'
  });
});

export default router;
