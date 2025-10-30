import express from 'express';
import cors from 'cors';
import { Bot } from 'grammy';
import { env } from './env.js';

const app = express();
app.use(express.json());

const allowed = env.WEB_APP_URL || '*';
app.use(cors({ origin: allowed }));

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

const bot = env.TELEGRAM_BOT_TOKEN ? new Bot(env.TELEGRAM_BOT_TOKEN) : undefined;

if (bot) {
  bot.command('start', async (ctx) => {
    const url = env.WEB_APP_URL || 'https://example.com';
    await ctx.reply('Assalomu alaykum! INTERNATION Mini App’ni ochish uchun tugmani bosing.', {
      reply_markup: {
        inline_keyboard: [[{ text: 'Open INTERNATION', web_app: { url } }]]
      }
    });
  });

  app.post('/telegram/webhook', async (req, res) => {
    try {
      await bot.handleUpdate(req.body);
      res.sendStatus(200);
    } catch (error) {
      console.error('handleUpdate error', error);
      res.sendStatus(500);
    }
  });
} else {
  app.post('/telegram/webhook', (_req, res) => res.sendStatus(200));
}

const port = env.PORT ? Number(env.PORT) : 8787;
app.listen(port, () => {
  console.log(`API listening on :${port}`);
});
