import { Database } from '@flowmodor/types';
import { createBrowserClient } from '@supabase/ssr';

export type SupabaseClient = ReturnType<typeof createBrowserClient<Database>>;

const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export default supabase;
