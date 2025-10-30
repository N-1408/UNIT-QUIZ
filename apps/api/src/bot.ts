import { Bot, InlineKeyboard } from 'grammy';
import { env } from './env.js';

const webAppDemoUrl = env.WEB_APP_URL || 'https://example.com';

export const bot = new Bot(env.TELEGRAM_BOT_TOKEN);

bot.command('start', async (ctx) => {
  const keyboard = new InlineKeyboard().webApp('Open App', webAppDemoUrl);
  await ctx.reply('CEFR Up — mini testga xush kelibsiz! Demo WebApp tugmasini bosing.', {
    reply_markup: keyboard
  });
});

bot.on('message:web_app_data', async (ctx) => {
  const payload = ctx.message.web_app_data?.data ?? '{}';
  await ctx.reply(`Demo ma’lumot olindi:\n${payload}`, {
    parse_mode: 'HTML'
  });
});
