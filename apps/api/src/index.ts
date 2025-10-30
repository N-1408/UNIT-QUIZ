import express from 'express';
import cors from 'cors';
import { Bot } from 'grammy';

const app = express();
app.use(express.json());

const allowed = process.env.WEB_APP_URL || '*';
app.use(cors({ origin: allowed }));

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.warn('TELEGRAM_BOT_TOKEN is missing');
}

const bot = token ? new Bot(token) : undefined;

if (bot) {
  bot.command('start', async (ctx) => {
    const url = process.env.WEB_APP_URL || 'https://example.com';
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

const port = Number(process.env.PORT) || 8787;
app.listen(port, () => {
  console.log(`API listening on :${port}`);
});
