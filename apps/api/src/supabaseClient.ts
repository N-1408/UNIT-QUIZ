import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Supabase environment variables missing!');
  console.error('SUPABASE_URL:', SUPABASE_URL ? '✅' : '❌');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_KEY ? '✅' : '❌');
  process.exit(1);
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testConnection() {
  try {
    const { error } = await supabase.from('users').select('id').limit(1);
    if (error) {
      throw error;
    }
    console.log('✅ Supabase connection successful!');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('❌ Supabase connection failed:', message);
  }
}

void testConnection();
