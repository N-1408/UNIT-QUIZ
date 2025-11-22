import cron from "node-cron";
import { Bot } from "grammy";
import { supabase } from "./supabaseService.js";

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
    console.warn("BOT_TOKEN is not set. Notifications will not be sent.");
}

const bot = BOT_TOKEN ? new Bot(BOT_TOKEN) : null;

export const startScheduler = () => {
    console.log("Starting notification scheduler...");

    // Run every minute
    cron.schedule("* * * * *", async () => {
        try {
            const now = new Date();
            const tenMinutesFromNow = new Date(now.getTime() + 10 * 60 * 1000);
            const elevenMinutesFromNow = new Date(now.getTime() + 11 * 60 * 1000);

            // Find exams starting in ~10 minutes that haven't sent notifications yet
            const { data: exams, error } = await supabase
                .from("exams")
                .select("*")
                .gte("start_time", tenMinutesFromNow.toISOString())
                .lt("start_time", elevenMinutesFromNow.toISOString())
                .eq("notification_sent", false);

            if (error) {
                console.error("Error fetching upcoming exams:", error);
                return;
            }

            if (!exams || exams.length === 0) return;

            for (const exam of exams) {
                console.log(`Sending notifications for exam: ${exam.title}`);

                // Fetch all students (in a real app, you might filter by group/access)
                const { data: students, error: studentError } = await supabase
                    .from("students")
                    .select("tg_id");

                if (studentError || !students) {
                    console.error("Error fetching students:", studentError);
                    continue;
                }

                let sentCount = 0;
                for (const student of students) {
                    if (bot && student.tg_id) {
                        try {
                            await bot.api.sendMessage(
                                student.tg_id,
                                `📢 <b>Imtihon eslatmasi!</b>\n\n"<b>${exam.title}</b>" imtihoni 10 daqiqadan so'ng boshlanadi.\n\nTayyorlaning! 🚀`,
                                { parse_mode: "HTML" }
                            );
                            sentCount++;
                        } catch (err) {
                            console.error(`Failed to send message to ${student.tg_id}:`, err);
                        }
                    }
                }

                // Mark as sent
                await supabase
                    .from("exams")
                    .update({ notification_sent: true })
                    .eq("id", exam.id);

                console.log(`Sent ${sentCount} notifications for exam ${exam.id}`);
            }
        } catch (err) {
            console.error("Scheduler error:", err);
        }
    });
};
