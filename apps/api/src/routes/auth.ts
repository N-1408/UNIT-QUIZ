import { Router, type Request, type Response } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../env.js';

const router = Router();

type TelegramUserPayload = {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
};

const SUPABASE_HEADERS = {
  apikey: env.SUPABASE_SERVICE_ROLE_KEY,
  Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
  'Content-Type': 'application/json'
} as const;

const SUPABASE_REST_URL = `${env.SUPABASE_URL.replace(/\/+$/, '')}/rest/v1`;
const ACCESS_TOKEN_TTL_SECONDS = 24 * 60 * 60;

router.post('/tma-auth', async (req: Request, res: Response) => {
  const { initData, token } = req.body ?? {};

  try {
    if (typeof initData === 'string' && initData.trim().length > 0) {
      console.info('auth:path=initData');
      const verifiedUser = verifyTelegramInitData(initData);
      if (!verifiedUser) {
        return res.status(401).json({ error: 'invalid_init_data' });
      }

      const tgId = String(verifiedUser.id);
      await upsertStudent({
        tgId,
        username: verifiedUser.username ?? null,
        fullName: buildFullName(verifiedUser.first_name, verifiedUser.last_name)
      });

      const accessToken = mintAccessToken(tgId);
      return res.json({
        access_token: accessToken,
        token_type: 'bearer',
        expires_in: ACCESS_TOKEN_TTL_SECONDS
      });
    }

    if (typeof token === 'string' && token.trim().length > 0) {
      console.info('auth:path=token');
      const trimmed = token.trim();
      const record = await getValidLoginToken(trimmed);
      if (!record) {
        return res.status(401).json({ error: 'invalid_token' });
      }

      const tgId = String(record.tg_id);
      await upsertStudent({
        tgId,
        username: record.username ?? null,
        fullName: record.full_name ?? null
      });

      await markTokenUsed(trimmed);

      const accessToken = mintAccessToken(tgId);
      return res.json({
        access_token: accessToken,
        token_type: 'bearer',
        expires_in: ACCESS_TOKEN_TTL_SECONDS
      });
    }

    console.warn('auth:path=missing');
    return res.status(400).json({ error: 'missing_payload' });
  } catch (error) {
    console.error('auth:error', error);
    return res.status(500).json({ error: 'auth_failed' });
  }
});

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

function verifyTelegramInitData(initData: string): TelegramUserPayload | null {
  try {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    if (!hash) return null;
    params.delete('hash');

    const sorted = Array.from(params.entries()).sort(([a], [b]) => a.localeCompare(b));
    const dataCheckString = sorted.map(([key, value]) => `${key}=${value}`).join('\n');

    const secret = crypto.createHmac('sha256', 'WebAppData').update(env.TELEGRAM_BOT_TOKEN).digest();
    const computedHash = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex');

    const expected = Buffer.from(computedHash, 'hex');
    const actual = Buffer.from(hash, 'hex');

    if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) {
      return null;
    }

    const userRaw = params.get('user');
    if (!userRaw) return null;
    const parsed = JSON.parse(userRaw) as TelegramUserPayload | undefined;
    if (!parsed?.id) return null;
    return parsed;
  } catch (error) {
    console.error('verifyTelegramInitData error:', error);
    return null;
  }
}

function buildFullName(first?: string, last?: string) {
  const parts = [first?.trim(), last?.trim()].filter(Boolean);
  return parts.length > 0 ? parts.join(' ') : null;
}

async function upsertStudent(input: { tgId: string; username: string | null; fullName: string | null }) {
  const response = await fetch(`${SUPABASE_REST_URL}/students`, {
    method: 'POST',
    headers: {
      ...SUPABASE_HEADERS,
      Prefer: 'resolution=merge-duplicates'
    },
    body: JSON.stringify([
      {
        tg_id: input.tgId,
        username: input.username,
        full_name: input.fullName
      }
    ])
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('upsertStudent error:', text);
    throw new Error('upsert_student_failed');
  }
}

type LoginTokenRow = {
  id: string;
  token: string;
  tg_id: string;
  username?: string | null;
  full_name?: string | null;
};

async function getValidLoginToken(token: string): Promise<LoginTokenRow | null> {
  const nowIso = new Date().toISOString();
  const query = new URLSearchParams({
    token: `eq.${token}`,
    'used_at': 'is.null',
    'expires_at': `gt.${nowIso}`,
    limit: '1'
  });

  const response = await fetch(`${SUPABASE_REST_URL}/login_tokens?${query.toString()}`, {
    method: 'GET',
    headers: {
      ...SUPABASE_HEADERS,
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('getValidLoginToken error:', text);
    throw new Error('login_token_lookup_failed');
  }

  const data = (await response.json()) as LoginTokenRow[];
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }
  return data[0] ?? null;
}

async function markTokenUsed(token: string) {
  const response = await fetch(`${SUPABASE_REST_URL}/login_tokens?token=eq.${encodeURIComponent(token)}`, {
    method: 'PATCH',
    headers: {
      ...SUPABASE_HEADERS,
      Prefer: 'return=minimal'
    },
    body: JSON.stringify({ used_at: new Date().toISOString() })
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('markTokenUsed error:', text);
    throw new Error('token_update_failed');
  }
}

function mintAccessToken(tgId: string) {
  return jwt.sign(
    {
      role: 'authenticated',
      tg_id: tgId
    },
    env.SUPABASE_JWT_SECRET,
    {
      expiresIn: ACCESS_TOKEN_TTL_SECONDS
    }
  );
}
