import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("\u274C Supabase env variables missing!");
  console.log("SUPABASE_URL:", SUPABASE_URL ? "\u2705 OK" : "\u274C Missing");
  console.log("SUPABASE_KEY:", SUPABASE_KEY ? "\u2705 OK" : "\u274C Missing");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Connection test
(async () => {
  try {
    console.log("\uD83D\uDD0D Checking Supabase connection...");
    const { error: testError } = await supabase.from("students").select("tg_id").limit(1);
    if (testError) {
      console.error("\u274C Supabase test failed:", testError.message);
    } else {
      console.log("\u2705 Supabase connection successful.");
    }
  } catch (err) {
    console.error("\u274C Supabase test failed:", (err as Error).message);
  }
})();
