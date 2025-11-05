import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { env } from './env.js';
import testsRouter from './routes/tests.js';
import usersRouter from './routes/users.js';
import { bot } from './bot.js';

console.log('Server starting...');
console.log('Environment check:');
console.log({
  SUPABASE_URL: Boolean(process.env.SUPABASE_URL),
  SUPABASE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY),
  BOT_TOKEN: Boolean(process.env.BOT_TOKEN),
  PORT: process.env.PORT || 'default'
});

const app = express();
app.enable('trust proxy');
app.use(express.json({ limit: '2mb' }));

app.use(
  cors({
    origin: env.APP_ORIGIN,
    credentials: true
  })
);

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.get('/', (_req, res) => res.json({ ok: true, name: 'Nova LC UNIT QUIZ API' }));
app.get('/health', (_req, res) => res.status(200).send('OK'));

app.post('/telegram/webhook', async (req, res) => {
  try {
    console.log('Webhook update:', JSON.stringify(req.body));
    await bot.handleUpdate(req.body);
    res.sendStatus(200);
  } catch (error) {
    console.error('handleUpdate error:', error);
    res.sendStatus(200);
  }
});

app.use('/api', testsRouter);
app.use('/api', usersRouter);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Global error:', err);
  res.status(500).json({ ok: false, error: 'internal' });
});

const port = Number(process.env.PORT ?? env.PORT ?? 3000);

await bot.init();
console.log(`Bot initialized as @${bot.botInfo?.username}`);

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
