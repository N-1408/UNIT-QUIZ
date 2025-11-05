import { z } from 'zod';

const EnvSchema = z.object({
  BOT_TOKEN: z.string().min(1, 'BOT_TOKEN required'),
  APP_ORIGIN: z.string().url('APP_ORIGIN must be a valid URL'),
  DATABASE_URL: z.string().min(1).optional(),
  PORT: z.string().optional()
});

export const env = EnvSchema.parse({
  BOT_TOKEN: process.env.BOT_TOKEN,
  APP_ORIGIN: process.env.APP_ORIGIN,
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT
});
