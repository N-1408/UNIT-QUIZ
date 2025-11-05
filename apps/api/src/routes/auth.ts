import { Router, type Request, type Response } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';
import { env } from '../env.js';

const router = Router();

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const COOKIE_NAME = 'qid';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

router.post('/telegram-login', async (req: Request, res: Response) => {
  const rawBody = req.body ?? {};
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(rawBody)) {
    normalized[key] = String(value ?? '');
  }

  const requiredFields = ['id', 'auth_date', 'hash'];
  if (requiredFields.some((field) => !normalized[field])) {
    return res.status(400).json({ error: 'missing_fields' });
  }

  const hash = normalized.hash;
  const dataCheckString = Object.keys(normalized)
    .filter((key) => key !== 'hash')
    .sort()
    .map((key) => `${key}=${normalized[key]}`)
    .join('\n');

  const secret = crypto.createHash('sha256').update(env.BOT_TOKEN).digest();
  const hmac = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex');

  if (hmac !== hash) {
    return res.status(403).json({ error: 'invalid_hash' });
  }

  const tgId = String(normalized.id);
  const fullName = buildFullName(normalized.first_name, normalized.last_name);
  const username = normalized.username ? normalized.username : null;
  const photoUrl = normalized.photo_url ? normalized.photo_url : null;

  const { data: student, error } = await supabase
    .from('students')
    .upsert(
      {
        tg_id: tgId,
        full_name: fullName,
        username,
        photo_url: photoUrl
      },
      { onConflict: 'tg_id' }
    )
    .select()
    .single();

  if (error || !student) {
    console.error('telegram-login upsert error:', error);
    return res.status(500).json({ error: 'upsert_failed' });
  }

  const token = jwt.sign({ tg_id: student.tg_id }, env.SUPABASE_JWT_SECRET, { expiresIn: '7d' });

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: COOKIE_MAX_AGE
  });

  return res.redirect(`${env.APP_ORIGIN.replace(/\/$/, '')}/tests`);
});

router.get('/auth/me', async (req: Request, res: Response) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ error: 'not_authenticated' });
  }

  try {
    const payload = jwt.verify(token, env.SUPABASE_JWT_SECRET) as { tg_id: string };
    const { data: student, error } = await supabase
      .from('students')
      .select('tg_id, full_name, username, photo_url')
      .eq('tg_id', payload.tg_id)
      .maybeSingle();

    if (error) {
      console.error('auth/me lookup error:', error);
      return res.status(500).json({ error: 'lookup_failed' });
    }

    if (!student) {
      return res.status(404).json({ error: 'student_not_found' });
    }

    return res.json(student);
  } catch (error) {
    console.error('auth/me token error:', error);
    return res.status(401).json({ error: 'invalid_token' });
  }
});

router.post('/auth/logout', (_req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: 'none',
    secure: true
  });
  return res.json({ ok: true });
});

export default router;

function buildFullName(first?: string, last?: string) {
  const firstClean = first?.trim();
  const lastClean = last?.trim();
  return [firstClean, lastClean].filter(Boolean).join(' ') || null;
}
