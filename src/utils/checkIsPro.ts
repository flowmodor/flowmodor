import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { getServerClient } from './supabase';
import getAccessToken from './paypal';

export default async function checkIsPro(cookieStore: ReadonlyRequestCookies) {
  const supabase = getServerClient(cookieStore);
  const { data } = await supabase
    .from('plans')
    .select('subscription_id')
    .single();
  const id = data?.subscription_id;

  let status = null;
  let endTime = null;

  try {
    const accessToken = await getAccessToken();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PAYPAL_API_URL}/billing/subscriptions/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch subscription');
    }

    const subscription = await response.json();
    status = subscription.status;
    endTime = subscription.billing_info.next_billing_time;
  } catch (error) {
    console.error(error);
  }

  return status === 'ACTIVE' || new Date(endTime) > new Date();
}
