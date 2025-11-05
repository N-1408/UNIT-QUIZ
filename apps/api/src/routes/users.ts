import { Router } from 'express';
import { getStudentByTgId } from '../supabaseService.js';

const router = Router();

router.get('/users/:telegramId', async (req, res) => {
  const telegramId = req.params.telegramId?.trim();

  if (!telegramId) {
    return res.status(400).json({ ok: false, error: 'missing_telegram_id' });
  }

  const numericId = Number(telegramId);
  if (!Number.isFinite(numericId)) {
    return res.status(400).json({ ok: false, error: 'invalid_telegram_id' });
  }

  try {
    const result = await getStudentByTgId(numericId);

    if (!result.success) {
      console.error('get user error:', result.message ?? 'Unknown error');
      return res.status(500).json({ ok: false, error: 'internal_error' });
    }

    const user = result.data;

    if (!user) {
      return res.status(404).json({ ok: false, error: 'user_not_found' });
    }

    const segments = (user.full_name ?? '').trim().split(/\s+/).filter(Boolean);
    const [firstName = null, ...rest] = segments;
    const lastName = rest.length ? rest.join(' ') : null;

    return res.json({
      telegramId: String(user.tg_id),
      tgId: user.tg_id,
      fullName: user.full_name,
      firstName,
      lastName,
      tgUsername: user.tg_username ?? null,
      phoneNumber: user.phone_number ?? null,
      lang: user.lang ?? null,
      role: user.role ?? null,
      createdAt: user.created_at
    });
  } catch (error) {
    console.error('get user error:', error);
    return res.status(500).json({ ok: false, error: 'internal_error' });
  }
});

export default router;
