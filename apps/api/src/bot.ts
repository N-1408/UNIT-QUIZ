import { Bot, InlineKeyboard, Keyboard } from 'grammy';
import { env } from './env.js';
import { usersStore } from './storage.js';

const openAppButton = new InlineKeyboard().webApp('Ilovani ochish', env.APP_ORIGIN);

const requestContactKeyboard = new Keyboard()
  .requestContact('Raqamni yuborish (Send Contact)')
  .resized()
  .oneTime();

export const bot = new Bot(env.BOT_TOKEN);

bot.catch((error) => {
  console.error('grammy error:', error);
});

bot.command('start', async (ctx) => {
  const from = ctx.from;
  if (!from) {
    return;
  }

  const telegramId = String(from.id);
  const existing = usersStore.findByTelegramId(telegramId);

  if (existing) {
    const firstName = existing.firstName || from.first_name || "do'stimiz";
    await ctx.reply(`👋 Yana sizmi, ${firstName}? 😄\nSiz allaqachon tizimdasiz. Quyidagi tugma orqali UNIT QUIZ'ni oching.`, {
      reply_markup: openAppButton
    });
    return;
  }

  const firstName = from.first_name || "do'stimiz";
  await ctx.reply(
    `Salom, ${firstName}! 👋\nBu sizning Nova LC test tizimingiz — UNIT QUIZ.\nDavom etishdan oldin, iltimos, ro'yxatdan o'tish uchun raqamingizni yuboring 📱`,
    {
      reply_markup: requestContactKeyboard
    }
  );
});

bot.on('message:contact', async (ctx) => {
  const from = ctx.from;
  const contact = ctx.message.contact;

  if (!from || !contact) {
    return;
  }

  if (contact.user_id && contact.user_id !== from.id) {
    await ctx.reply("Iltimos, faqat o'zingizning raqamingizni yuboring.");
    return;
  }

  usersStore.upsert({
    telegramId: String(from.id),
    firstName: contact.first_name || from.first_name || '',
    lastName: contact.last_name ?? from.last_name ?? null,
    username: from.username ?? null,
    phoneNumber: contact.phone_number
  });

  await ctx.reply("✅ Ro'yxatdan o'tish muvaffaqiyatli yakunlandi!\nEndi siz Nova LC test platformasidan foydalanishingiz mumkin.", {
    reply_markup: openAppButton
  });
});
