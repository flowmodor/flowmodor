import { nanoid } from 'nanoid';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getRouteClient } from '@/utils/supabase';

// eslint-disable-next-line import/prefer-default-export
export async function GET() {
  const cookieStore = cookies();

  const supabase = getRouteClient(cookieStore);
  const { data: integrationsData } = await supabase
    .from('integrations')
    .select('provider, access_token')
    .single();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (integrationsData?.provider === 'todoist') {
    const { error } = await supabase
      .from('integrations')
      .update({ provider: null, access_token: null })
      .eq('user_id', user!.id);

    if (error) {
      console.error(error);
    } else {
      redirect('/settings');
    }
  }

  const url = new URL('https://todoist.com/oauth/authorize');
  url.searchParams.append(
    'client_id',
    process.env.NEXT_PUBLIC_TODOIST_CLIENT_ID,
  );
  url.searchParams.append('scope', 'data:read_write');

  const state = nanoid();
  cookieStore.set('todoist_state', state, { maxAge: 60 * 60 });
  url.searchParams.append('state', state);

  redirect(url.toString());
}
