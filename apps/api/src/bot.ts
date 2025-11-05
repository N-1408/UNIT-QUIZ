import { Bot, Keyboard } from "grammy";
import { env } from "./env.js";
import { supabase } from "./supabaseClient.js";

const WEB_APP_URL = "https://unitquiz.vercel.app";
const DOMAIN_WARNING = "WARNING: BotFather domeningizni yangilang -> /setdomain -> https://unitquiz.vercel.app";
const REGISTRATION_ERROR_MESSAGE =
  "\u26A0\uFE0F WARNING: Ulanishda muammo yuz berdi.\nIltimos, qayta urinib ko\u2018ring yoki o\u2018quv markaz bilan bog\u2018laning.";
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

  const telegramId = String(from.id);

  try {
    const { data: existingStudent, error: existingError } = await supabase
      .from("students")
      .select("id")
      .eq("id", telegramId)
      .single();

    if (existingError && existingError.code !== "PGRST116") {
      console.error("Supabase lookup error:", existingError.message);
      console.error("Error details:", JSON.stringify(existingError, Object.getOwnPropertyNames(existingError), 2));
      await ctx.reply(REGISTRATION_ERROR_MESSAGE);
      return;
    }

    if (existingStudent) {
      await ctx.reply(`\uD83D\uDC4B Yana sizmi, ${from.first_name ?? "do'stimiz"}? \uD83D\uDE0A\nSiz allaqachon tizimdasiz!`, {
        reply_markup: {
          inline_keyboard: [[{ text: "Ilovani ochish", web_app: { url: WEB_APP_URL } }]]
        }
      });
      return;
    }
  } catch (error) {
    console.error("Supabase lookup error:", (error as Error).message);
    await ctx.reply(REGISTRATION_ERROR_MESSAGE);
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
    const firstName = contact.first_name || from.first_name || "";
    const lastName = contact.last_name ?? from.last_name ?? "";
    const fullName = `${firstName}${lastName ? ` ${lastName}` : ""}`.trim();

    const { data, error } = await supabase.from("students").upsert({
      id: from.id.toString(),
      full_name: fullName
    });

    if (error) {
      console.error("\u274C Supabase insert failed:", error.message);
      console.error("Error details:", JSON.stringify(error, null, 2));
      await ctx.reply(REGISTRATION_ERROR_MESSAGE);
      return;
    }

    console.log("\u2705 Student added successfully:", data);

    await ctx.reply(REGISTRATION_SUCCESS_MESSAGE, {
      reply_markup: {
        inline_keyboard: [[{ text: "Ilovani ochish", web_app: { url: WEB_APP_URL } }]]
      }
    });
  } catch (error) {
    const err = error as Error;
    console.error("\u274C Supabase insert failed:", err.message);
    console.error("Error details:", JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
    await ctx.reply(REGISTRATION_ERROR_MESSAGE);
    return;
  }
});

bot.command("test", async (ctx) => {
  await ctx.reply("WebApp ochish sinovi", {
    reply_markup: {
      inline_keyboard: [[{ text: "UNIT QUIZ ochish", web_app: { url: WEB_APP_URL } }]]
    }
  });
});
