import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { Bot } from 'grammy';
import { env } from './env.js';

const app = express();
app.enable('trust proxy');
app.use(express.json({ limit: '2mb' }));

const allowed = env.WEB_APP_URL || '*';
app.use(cors({ origin: allowed }));

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.get('/', (_req, res) => res.json({ ok: true, name: 'INTERNATION API' }));
app.get('/health', (_req, res) => res.json({ ok: true }));

let bot: Bot | undefined;

try {
  if (env.TELEGRAM_BOT_TOKEN) {
    bot = new Bot(env.TELEGRAM_BOT_TOKEN);

    bot.catch((err) => console.error('grammy error:', err));

    bot.command('start', async (ctx) => {
      const url = env.WEB_APP_URL || 'https://example.com';
      await ctx.reply('Assalomu alaykum! INTERNATION Mini App’ni ochish uchun tugmani bosing.', {
        reply_markup: {
          inline_keyboard: [[{ text: 'Open INTERNATION', web_app: { url } }]]
        }
      });
    });
  } else {
    console.warn('TELEGRAM_BOT_TOKEN is missing');
  }
} catch (error) {
  console.error('Bot init constructor error:', error);
}

app.post('/telegram/webhook', async (req, res) => {
  try {
    console.log('Webhook update:', JSON.stringify(req.body));
    if (bot) {
      await bot.handleUpdate(req.body);
    } else {
      console.warn('Webhook called but bot is undefined');
    }
    res.sendStatus(200);
  } catch (error) {
    console.error('handleUpdate error:', error);
    res.sendStatus(200);
  }
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Global error:', err);
  res.status(500).json({ ok: false, error: 'internal' });
});

const port = Number(env.PORT) || 8787;

if (bot) {
  await bot.init();
  console.log(`Bot initialized as @${bot.botInfo?.username}`);
}

app.listen(port, () => {
  console.log(`API listening on :${port}`);
});
