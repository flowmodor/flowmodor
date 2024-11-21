import { SupabaseClient } from '@supabase/supabase-js';
import { Database, Tables } from './supabase';

export type LogsWithTasks = Tables<'logs'> & {
  tasks: {
    name: string;
  } | null;
};

export type Supabase = SupabaseClient<Database>;

export interface Task {
  id: string;
  name: string;
  completed: boolean;
  labels?: string[];
  due?: Date | null;
}

export interface List {
  name: string;
  id: string;
}
