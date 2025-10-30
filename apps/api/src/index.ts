import express from 'express';
import { webhookCallback } from 'grammy';
import { bot } from './bot';
import authRouter from './routes/auth';
import testsRouter from './routes/tests';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.post(
  '/telegram/webhook',
  webhookCallback(bot, 'express', {
    timeoutMilliseconds: 10000
  })
);

app.use('/auth', authRouter);
app.use('/', testsRouter);

const port = Number(process.env.PORT ?? 8787);

async function bootstrap() {
  await bot.init();
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${port}`);
  });
}

void bootstrap();
