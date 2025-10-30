import 'dotenv/config';
import { z } from 'zod';

const EnvSchema = z.object({
  TELEGRAM_BOT_TOKEN: z.string().min(1, 'TELEGRAM_BOT_TOKEN is required'),
  ADMIN_CHANNEL_ID: z.string().optional(),
  SUPABASE_URL: z.string().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_KEY: z.string().optional()
});

const result = EnvSchema.safeParse(process.env);

if (!result.success) {
  const issues = result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('\n');
  throw new Error(`Invalid environment variables:\n${issues}`);
}

export const env = result.data;
