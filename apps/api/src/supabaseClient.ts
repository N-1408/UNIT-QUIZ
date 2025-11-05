import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_KEY ||
  process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Supabase environment variables missing!');
  console.error('SUPABASE_URL:', SUPABASE_URL ? 'present' : 'missing');
  console.error('SUPABASE_KEY:', SUPABASE_KEY ? 'present' : 'missing');
  process.exit(1);
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
