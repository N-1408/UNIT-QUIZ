import { Bot, Keyboard } from "grammy";
import { env } from "./env.js";
import { getUserById, upsertUser } from "./users.js";

const WEB_APP_URL = "https://unitquiz.vercel.app";
const DOMAIN_WARNING = "WARNING: BotFather domeningizni yangilang -> /setdomain -> https://unitquiz.vercel.app";

if (env.APP_ORIGIN !== WEB_APP_URL) {
  console.warn(DOMAIN_WARNING);
}

const requestContactKeyboard = new Keyboard()
  .requestContact("Raqamni yuborish (Send Contact)")
  .resized()
  .oneTime();

export const bot = new Bot(env.BOT_TOKEN);

bot.catch((error) => {
  console.error("grammy error:", error);
});

bot.command("start", async (ctx) => {
  const from = ctx.from;
  if (!from) {
    return;
  }

  const telegramId = String(from.id);

  try {
    const existing = await getUserById(telegramId);

    if (existing) {
      const firstName = existing.first_name || from.first_name || "do'stimiz";
      await ctx.reply(
        `Yana sizmi, ${firstName}? :)\nSiz allaqachon tizimdasiz. Quyidagi tugma orqali UNIT QUIZ'ni oching.`,
        {
          reply_markup: {
            inline_keyboard: [[{ text: "Ilovani ochish", web_app: { url: WEB_APP_URL } }]]
          }
        }
      );
      return;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Supabase lookup error:", message);
    await ctx.reply(
      "WARNING: Ulanishda muammo yuz berdi.\nIltimos, qayta urinib ko'ring yoki o'quv markaz bilan bog'laning."
    );
    return;
  }

  const firstName = from.first_name || "do'stimiz";
  await ctx.reply(
    `Salom, ${firstName}!\nBu sizning Nova LC test tizimingiz - UNIT QUIZ.\nDavom etishdan oldin, iltimos, ro'yxatdan o'tish uchun telefon raqamingizni yuboring.`,
    {
      reply_markup: requestContactKeyboard
    }
  );
});

bot.on("message:contact", async (ctx) => {
  const from = ctx.from;
  const contact = ctx.message.contact;

  if (!from || !contact) {
    return;
  }

  if (contact.user_id && contact.user_id !== from.id) {
    await ctx.reply("Iltimos, faqat o'zingizning raqamingizni yuboring.");
    return;
  }

  try {
    await upsertUser({
      id: String(from.id),
      firstName: contact.first_name || from.first_name || "",
      lastName: contact.last_name ?? from.last_name ?? null,
      phoneNumber: contact.phone_number
    });

    await ctx.reply(
      "Ro'yxatdan o'tish muvaffaqiyatli yakunlandi! Endi siz Nova LC test platformasidan foydalanishingiz mumkin.",
      {
        reply_markup: {
          inline_keyboard: [[{ text: "Ilovani ochish", web_app: { url: WEB_APP_URL } }]]
        }
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Supabase insert error:", message);
    await ctx.reply(
      "⚠️ WARNING: Ulanishda muammo yuz berdi.\nIltimos, qayta urinib ko'ring yoki o'quv markaz bilan bog'laning."
    );
  }
});

bot.command("test", async (ctx) => {
  await ctx.reply("WebApp ochish sinovi", {
    reply_markup: {
      inline_keyboard: [[{ text: "UNIT QUIZ ochish", web_app: { url: WEB_APP_URL } }]]
    }
  });
});


