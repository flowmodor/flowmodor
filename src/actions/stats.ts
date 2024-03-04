'use server';

import { cookies } from 'next/headers';
import { getActionClient } from '@/utils/supabase';

// eslint-disable-next-line import/prefer-default-export
export async function fetchLogs(date: Date) {
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  const supabase = getActionClient(cookies());
  const { data, error } = await supabase
    .from('logs')
    .select('*, tasks(name)')
    .gte('start_time', startDate.toISOString())
    .lte('start_time', endDate.toISOString());

  return { data, error };
}
