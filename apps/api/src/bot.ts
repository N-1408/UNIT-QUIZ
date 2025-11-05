import { Bot, InlineKeyboard, Keyboard } from "grammy";
import { env } from "./env.js";
import { getOrCreateStudent, getStudentByTgId } from "./supabaseService.js";

const ERROR_MESSAGE =
  "\u26A0\uFE0F Ulanishda muammo yuz berdi.\nIltimos, birozdan so'ng qayta urinib ko'ring yoki o'quv markazimiz bilan bog'laning.";

export const bot = new Bot(env.BOT_TOKEN);

const buildAppUrl = (telegramId: number) => `${env.APP_ORIGIN}/?tg_id=${telegramId}`;

const createOpenAppButton = (telegramId: number) =>
  new InlineKeyboard().webApp("\u{1F680} Ilovani ochish", buildAppUrl(telegramId));

const requestContactKeyboard = new Keyboard()
  .requestContact("\u{1F4DE} Raqamni yuborish")
  .resized()
  .oneTime();

bot.catch((error) => {
  console.error("grammy error:", error);
});

bot.command("start", async (ctx) => {
  try {
    const from = ctx.from;
    if (!from) {
      return;
    }

    const telegramId = from.id;
    const studentResult = await getStudentByTgId(telegramId);

    if (!studentResult.success) {
      console.error("Supabase lookup error:", studentResult.message ?? "Unknown error");
      await ctx.reply(ERROR_MESSAGE);
      return;
    }

    const firstName = from.first_name ?? "do'stimiz";

    if (studentResult.data) {
      await ctx.reply(
        `\u{1F44B} Yana sizmi, ${firstName}? \u{1F604}\nSiz allaqachon tizimdasiz. Quyidagi tugma orqali UNIT QUIZ'ni oching.`,
        { reply_markup: createOpenAppButton(telegramId) }
      );
      return;
    }

    await ctx.reply(
      `Salom, ${firstName}! \u{1F44B}\nSiz hozir Nova LC test tizimidamiz — UNIT QUIZ.\nBoshlashdan oldin, ro'yxatdan o'tish uchun telefon raqamingizni yuboring. \u{1F4F1}`,
      { reply_markup: requestContactKeyboard }
    );
  } catch (error) {
    console.error("Error in /start handler:", error);
    await ctx.reply(ERROR_MESSAGE);
  }
});

bot.on("message:contact", async (ctx) => {
  try {
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
    const fullName =
      `${firstName}${lastName ? ` ${lastName}` : ""}`.trim() || `Telegram foydalanuvchisi ${telegramId}`;
    const username = from.username ?? null;
    const phone = contact.phone_number ?? null;

    console.log("\u{1F4DE} Received contact:", phone ?? "no phone");

    const result = await getOrCreateStudent(telegramId, fullName, username, phone);

    if (!result.success) {
      console.error("\u274C Supabase insert failed:", result.message ?? "Unknown error");
      await ctx.reply(ERROR_MESSAGE);
      return;
    }

    console.log("\u2705 Student upserted:", [result.data]);

    await ctx.reply(
      `\u2705 Ro'yxatdan o'tish muvaffaqiyatli yakunlandi!\nEndi siz Nova LC test platformasidan foydalanishingiz mumkin. \u{1F525}\nBoshlash uchun "Ilovani ochish" tugmasini bosing \u{1F447}`,
      { reply_markup: createOpenAppButton(telegramId) }
    );
  } catch (error) {
    console.error("Error handling contact:", error);
    await ctx.reply(ERROR_MESSAGE);
  }
});

bot.command("test", async (ctx) => {
  try {
    const from = ctx.from;
    if (!from) {
      return;
    }

    await ctx.reply("WebApp ochish sinovi", {
      reply_markup: createOpenAppButton(from.id)
    });
  } catch (error) {
    console.error("Error in /test handler:", error);
    await ctx.reply(ERROR_MESSAGE);
  }
});
