import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { getServerClient } from './supabase';

export default async function checkIsPro(cookieStore: ReadonlyRequestCookies) {
  const supabase = getServerClient(cookieStore);
  const { data } = await supabase.from('plans').select('end_time').single();

  if (!data?.end_time) {
    return false;
  }

  return new Date(data.end_time) >= new Date();
}
