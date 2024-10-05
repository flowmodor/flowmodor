import { SupabaseClient } from '@supabase/supabase-js';
import { Database, Tables } from './supabase';

export type LogsWithTasks = Tables<'logs'> & {
  tasks: {
    name: string;
  } | null;
};

export type Supabase = SupabaseClient<Database>;
