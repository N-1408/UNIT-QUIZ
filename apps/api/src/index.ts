import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import { env } from './env.js';
import testsRouter from './routes/tests.js';
import usersRouter from './routes/users.js';
import examsRouter from './routes/exams.js';
import attemptsRouter from './routes/attempts.js';
import uploadRouter from './routes/upload.js';
import logRouter from './routes/log.js';
import { bot } from './bot.js';

console.log('Server starting...');
console.log('Environment check:');
console.log({
  SUPABASE_URL: Boolean(process.env.SUPABASE_URL),
  SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  SUPABASE_ANON_KEY: Boolean(process.env.SUPABASE_ANON_KEY),
  SUPABASE_JWT_SECRET: Boolean(process.env.SUPABASE_JWT_SECRET),
  BOT_TOKEN: Boolean(process.env.BOT_TOKEN),
  APP_ORIGIN: Boolean(process.env.APP_ORIGIN),
  ADMIN_CHANNEL_ID: Boolean(process.env.ADMIN_CHANNEL_ID)
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

app.use('/api/log', logRouter);
app.use('/api', testsRouter);
app.use('/api', usersRouter);
app.use('/api', examsRouter);
app.use('/api', attemptsRouter);
app.use('/api/upload', uploadRouter);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Global error:', err);
  res.status(500).json({ ok: false, error: 'internal' });
});

const port = process.env.PORT || 8080;

await bot.init();
console.log(`Bot initialized as @${bot.botInfo?.username}`);

app.listen(port, () => {
  console.log(`\u2705 Server running on port ${port}`);
});
