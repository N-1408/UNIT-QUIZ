import { Router, type Request, type Response } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';
import { env } from '../env.js';

const router = Router();

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const COOKIE_NAME = 'qid';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

type TelegramInitUser = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
};

router.post('/auth/verify', async (req: Request, res: Response) => {
  try {
    const { initData } = req.body ?? {};

    const initDataString = normalizeInitData(initData);
    if (!initDataString) {
      return res.json({ ok: false, reason: 'missing_init_data' });
    }

    const params = new URLSearchParams(initDataString);
    const hash = params.get('hash');
    if (!hash) {
      return res.json({ ok: false, reason: 'missing_hash' });
    }

    const dataCheckString = buildDataCheckString(params);
    if (!verifyHash(dataCheckString, hash)) {
      return res.json({ ok: false, reason: 'invalid_hash' });
    }

    const userPayload = extractUser(params);
    if (!userPayload) {
      return res.json({ ok: false, reason: 'user_missing' });
    }

    const fullName = buildFullName(userPayload.first_name, userPayload.last_name);
    const { data: student, error } = await supabase
      .from('students')
      .upsert(
        {
          tg_id: String(userPayload.id),
          full_name: fullName,
          username: userPayload.username ?? null,
          photo_url: userPayload.photo_url ?? null
        },
        { onConflict: 'tg_id' }
      )
      .select()
      .single();

    if (error || !student) {
      console.error('auth/verify upsert error:', error);
      return res.status(500).json({ ok: false, reason: 'upsert_failed' });
    }

    const token = jwt.sign({ tg_id: student.tg_id }, env.SUPABASE_JWT_SECRET, { expiresIn: '7d' });

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: COOKIE_MAX_AGE
    });

    return res.json({
      ok: true,
      user: {
        tg_id: student.tg_id,
        full_name: student.full_name,
        username: student.username,
        photo_url: student.photo_url
      }
    });
  } catch (error) {
    console.error('auth/verify error:', error);
    return res.status(500).json({ ok: false, reason: 'server_error' });
  }
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

function normalizeInitData(initData: unknown): string | null {
  if (!initData) return null;
  if (typeof initData === 'string') {
    return initData.trim() || null;
  }

  if (typeof initData === 'object') {
    try {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(initData as Record<string, unknown>)) {
        params.set(
          key,
          typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value ?? '')
        );
      }
      return params.toString();
    } catch {
      return null;
    }
  }

  return null;
}

function buildDataCheckString(params: URLSearchParams) {
  return Array.from(params.entries())
    .filter(([key]) => key !== 'hash')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
}

function verifyHash(dataCheckString: string, hash: string) {
  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(env.BOT_TOKEN).digest();
  const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
  return calculatedHash === hash;
}

function extractUser(params: URLSearchParams): TelegramInitUser | null {
  const userJson = params.get('user');
  if (!userJson) {
    return null;
  }

  try {
    const parsed = JSON.parse(userJson) as TelegramInitUser;
    if (!parsed?.id) {
      return null;
    }
    return parsed;
  } catch (error) {
    console.error('Failed to parse Telegram user', error);
    return null;
  }
}
