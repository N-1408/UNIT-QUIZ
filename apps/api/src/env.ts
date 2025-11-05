import { z } from 'zod';

const EnvSchema = z.object({
  BOT_TOKEN: z.string().min(1, 'BOT_TOKEN required'),
  APP_ORIGIN: z.string().url('APP_ORIGIN must be a valid URL'),
  SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL'),
  SUPABASE_KEY: z.string().min(1, 'SUPABASE_KEY required'),
  PORT: z.string().optional()
});

export const env = EnvSchema.parse({
  BOT_TOKEN: process.env.BOT_TOKEN,
  APP_ORIGIN: process.env.APP_ORIGIN,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_KEY,
  PORT: process.env.PORT
});
