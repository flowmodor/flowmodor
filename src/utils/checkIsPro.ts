import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import getAccessToken from './paypal';
import { getServerClient } from './supabase';

export default async function checkIsPro(cookieStore: ReadonlyRequestCookies) {
  const supabase = getServerClient(cookieStore);
  const { data } = await supabase
    .from('plans')
    .select('end_time, subscription_id')
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
    endTime = subscription?.billing_info?.next_billing_time;
    console.log(endTime);
  } catch (error) {
    console.error(error);
  }

  if (endTime) {
    supabase.from('plans').update({ end_time: endTime }).single();
  } else {
    endTime = data?.end_time;
  }

  return status === 'ACTIVE' || new Date(endTime) > new Date();
}
