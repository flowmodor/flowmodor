import { nanoid } from 'nanoid';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// eslint-disable-next-line import/prefer-default-export
export function GET() {
  const cookieStore = cookies();

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
