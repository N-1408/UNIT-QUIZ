import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Supabase env variables missing!");
  console.log("SUPABASE_URL:", SUPABASE_URL ? "✅ OK" : "❌ Missing");
  console.log("SUPABASE_SERVICE_ROLE_KEY:", SUPABASE_SERVICE_ROLE_KEY ? "✅ OK" : "❌ Missing");
  throw new Error("Supabase environment variables are not configured.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export const supabaseAnon = SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// Connection test
(async () => {
  try {
    console.log("🔍 Checking Supabase connection...");
    const { error: testError } = await supabase.from("students").select("tg_id").limit(1);
    if (testError) {
      console.error("❌ Supabase test failed:", testError.message);
    } else {
      console.log("✅ Supabase connection successful.");
    }
  } catch (err) {
    console.error("❌ Supabase test failed:", (err as Error).message);
  }
})();
