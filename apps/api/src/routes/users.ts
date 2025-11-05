import { Router } from 'express';
import { getUserById } from '../users.js';

const router = Router();

router.get('/users/:telegramId', async (req, res) => {
  const telegramId = req.params.telegramId?.trim();

  if (!telegramId) {
    return res.status(400).json({ ok: false, error: 'missing_telegram_id' });
  }

  try {
    const user = await getUserById(telegramId);

    if (!user) {
      return res.status(404).json({ ok: false, error: 'user_not_found' });
    }

    return res.json({
      telegramId: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      phoneNumber: user.phone_number,
      createdAt: user.created_at
    });
  } catch (error) {
    console.error('get user error:', error);
    return res.status(500).json({ ok: false, error: 'internal_error' });
  }
});

export default router;
