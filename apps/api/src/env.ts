import { z } from 'zod';

const EnvSchema = z.object({
  TELEGRAM_BOT_TOKEN: z.string().min(1, 'TELEGRAM_BOT_TOKEN required'),
  WEB_APP_URL: z.string().url().or(z.string().min(1)),
  ADMIN_CHANNEL_ID: z.string().optional(),
  PORT: z.string().optional()
});

export const env = EnvSchema.parse({
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  WEB_APP_URL: process.env.WEB_APP_URL,
  ADMIN_CHANNEL_ID: process.env.ADMIN_CHANNEL_ID,
  PORT: process.env.PORT
});
