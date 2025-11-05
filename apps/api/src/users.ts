import { supabase } from './supabaseClient.js';

export type SupabaseUser = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  created_at: string;
};

type CreateUserInput = {
  id: string;
  firstName: string;
  lastName?: string | null;
  phoneNumber: string;
};

export async function getUserById(id: string) {
  const { data, error } = await supabase.from('users').select('id, first_name, last_name, phone_number, created_at').eq('id', id).maybeSingle();

  if (error) {
    throw error;
  }

  return data as SupabaseUser | null;
}

export async function upsertUser(input: CreateUserInput) {
  const payload = {
    id: input.id,
    first_name: input.firstName,
    last_name: input.lastName ?? null,
    phone_number: input.phoneNumber
  };

  const { error, data } = await supabase.from('users').upsert(payload, { onConflict: 'id' }).select().maybeSingle();

  if (error) {
    throw error;
  }

  return data as SupabaseUser | null;
}
