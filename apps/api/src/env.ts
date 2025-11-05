import { z } from 'zod';

const EnvSchema = z.object({
  BOT_TOKEN: z.string().min(1, "BOT_TOKEN required"),
  APP_ORIGIN: z.string().url("APP_ORIGIN must be a valid URL"),
  ADMIN_CHANNEL_ID: z.string().optional(),
  SUPABASE_URL: z.string().url("SUPABASE_URL must be a valid URL"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_JWT_SECRET: z.string().optional()
});

export const env = EnvSchema.parse({
  BOT_TOKEN: process.env.BOT_TOKEN,
  APP_ORIGIN: process.env.APP_ORIGIN,
  ADMIN_CHANNEL_ID: process.env.ADMIN_CHANNEL_ID,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET
});
