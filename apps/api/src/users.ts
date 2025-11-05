import { supabase } from "./supabaseClient.js";

export type SupabaseStudent = {
  id: string;
  full_name: string;
  created_at: string;
};

export async function getUserById(id: string) {
  const { data, error } = await supabase
    .from("students")
    .select("id, full_name, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as SupabaseStudent | null;
}
