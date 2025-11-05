import { Bot, Keyboard } from "grammy";
import { env } from "./env.js";
import { getOrCreateStudent, getStudentByTgId } from "./supabaseService.js";

const WEB_APP_URL = "https://unitquiz.vercel.app";
const DOMAIN_WARNING = "WARNING: BotFather domeningizni yangilang -> /setdomain -> https://unitquiz.vercel.app";
const REGISTRATION_ERROR_MESSAGE = "\u26A0\uFE0F Ulanishda muammo yuz berdi, iltimos qayta urinib ko\u2018ring.";
const REGISTRATION_SUCCESS_MESSAGE = "\u2705 Ro'yxatdan o'tish muvaffaqiyatli yakunlandi!";

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

  const telegramId = from.id;

  const existing = await getStudentByTgId(telegramId);

  if (!existing.success) {
    console.error("Supabase lookup error:", existing.message ?? "Unknown error");
    await ctx.reply(REGISTRATION_ERROR_MESSAGE);
    return;
  }

  if (existing.data) {
    await ctx.reply(`\uD83D\uDC4B Yana sizmi, ${from.first_name ?? "do'stimiz"}? \uD83D\uDE0A\nSiz allaqachon tizimdasiz!`, {
      reply_markup: {
        inline_keyboard: [[{ text: "Ilovani ochish", web_app: { url: WEB_APP_URL } }]]
      }
    });
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

  const telegramId = from.id;
  const firstName = from.first_name || contact.first_name || "";
  const lastName = from.last_name || contact.last_name || "";
  const fullName = `${firstName}${lastName ? ` ${lastName}` : ""}`.trim() || `Telegram user ${telegramId}`;
  const username = from.username ?? null;
  const phone = contact.phone_number ?? null;

  console.log("\uD83D\uDCDE Received contact:", phone ?? "no phone");

  const result = await getOrCreateStudent(telegramId, fullName, username, phone);

  if (!result.success) {
    console.error("\u274C Supabase insert failed:", result.message ?? "Unknown error");
    await ctx.reply(REGISTRATION_ERROR_MESSAGE);
    return;
  }

  console.log("\u2705 Student upserted:", [result.data]);

  await ctx.reply(REGISTRATION_SUCCESS_MESSAGE, {
    reply_markup: {
      inline_keyboard: [[{ text: "Ilovani ochish", web_app: { url: WEB_APP_URL } }]]
    }
  });
});

bot.command("test", async (ctx) => {
  await ctx.reply("WebApp ochish sinovi", {
    reply_markup: {
      inline_keyboard: [[{ text: "UNIT QUIZ ochish", web_app: { url: WEB_APP_URL } }]]
    }
  });
});
