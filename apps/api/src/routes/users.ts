import { Router } from 'express';
import { usersStore } from '../storage.js';

const router = Router();

router.get('/users/:telegramId', (req, res) => {
  const telegramId = req.params.telegramId?.trim();

  if (!telegramId) {
    return res.status(400).json({ ok: false, error: 'missing_telegram_id' });
  }

  const user = usersStore.findByTelegramId(telegramId);

  if (!user) {
    return res.status(404).json({ ok: false, error: 'user_not_found' });
  }

  return res.json({
    telegramId: user.telegramId,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    phoneNumber: user.phoneNumber,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  });
});

export default router;
