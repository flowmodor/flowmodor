import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import getAccessToken from './paypal';
import { getServerClient } from './supabase';

export async function getPlan(cookieStore: ReadonlyRequestCookies) {
  const supabase = getServerClient(cookieStore);
  const { data } = await supabase
    .from('plans')
    .select('end_time, subscription_id')
    .single();
  const id = data?.subscription_id;

  let status = null;
  let endTime = null;
  let planId = null;

  if (!id) {
    return { status, endTime, planId };
  }

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
    planId = subscription.plan_id;
    status = subscription.status;
    endTime = subscription?.billing_info?.next_billing_time;
  } catch (error) {
    console.error(error);
  }

  if (endTime) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('plans')
      .update({ end_time: endTime })
      .eq('user_id', user!.id);

    if (error) {
      console.error(error);
    }
  } else {
    endTime = data?.end_time;
  }

  return { status, endTime, id: data?.subscription_id, planId };
}

export default async function checkIsPro(cookieStore: ReadonlyRequestCookies) {
  const { status, endTime } = await getPlan(cookieStore);

  return status === 'ACTIVE' || new Date(endTime) > new Date();
}
