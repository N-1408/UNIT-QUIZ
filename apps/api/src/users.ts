import { supabase } from "./supabaseClient.js";

export type SupabaseStudent = {
  id: string;
  tg_id: number;
  full_name: string;
  phone_number: string | null;
  created_at: string;
};

export async function getUserById(telegramId: string | number) {
  const numericId = typeof telegramId === "number" ? telegramId : Number(telegramId);

  if (!Number.isFinite(numericId)) {
    throw new Error(`Invalid telegram id: ${telegramId}`);
  }

  const { data, error } = await supabase
    .from("students")
    .select("id, tg_id, full_name, phone_number, created_at")
    .eq("tg_id", numericId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as SupabaseStudent | null;
}
