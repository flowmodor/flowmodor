import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { getServerClient } from './supabase';

export default async function checkIsPro(cookieStore: ReadonlyRequestCookies) {
  const supabase = getServerClient(cookieStore);
  const { data } = await supabase
    .from('plans')
    .select('end_time, status')
    .single();

  const { status, end_time: endTime } = data ?? {};
  return status === 'ACTIVE' || new Date(endTime) > new Date();
}
