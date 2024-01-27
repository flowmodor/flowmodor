/* eslint-disable import/prefer-default-export */
import getAccessToken from '@/utils/paypal';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies, headers } from 'next/headers';

export async function POST(request: Request) {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    },
  );

  const headerList = headers();
  const transmissionId = headerList.get('paypal-transmission-id');
  const transmissionTime = headerList.get('paypal-transmission-time');
  const certUrl = headerList.get('paypal-cert-url');
  const authAlgo = headerList.get('paypal-auth-algo');
  const transmissionSig = headerList.get('paypal-transmission-sig');

  const rawBody = await request.text();
  const body = JSON.parse(rawBody);
  const accessToken = await getAccessToken();
  const verifyResponse = await fetch(
    `${process.env.NEXT_PUBLIC_PAYPAL_API_URL}/notifications/verify-webhook-signature`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        auth_algo: authAlgo,
        cert_url: certUrl,
        transmission_id: transmissionId,
        transmission_sig: transmissionSig,
        transmission_time: transmissionTime,
        webhook_id: process.env.PAYPAL_WEBHOOK_ID,
        webhook_event: body,
      }),
    },
  );

  const verifyBody = await verifyResponse.json();
  if (verifyBody.verification_status !== 'SUCCESS') {
    return new Response('Error verifying webhook', { status: 500 });
  }

  if (body.event_type === 'BILLING.SUBSCRIPTION.CREATED') {
    const { error } = await supabase
      .from('plans')
      .update({
        subscription_id: body.resource.id,
        status: body.resource.status,
      })
      .eq('user_id', body.resource.custom_id);

    if (!error) {
      return new Response('Subscription created successfully', { status: 200 });
    }

    console.error(error);
    return new Response('Error creating subscription', { status: 500 });
  }

  if (body.event_type === 'BILLING.SUBSCRIPTION.ACTIVATED') {
    const { error } = await supabase
      .from('plans')
      .update({
        subscription_id: body.resource.id,
        end_time: body.resource.billing_info.next_billing_time,
        status: body.resource.status,
      })
      .eq('user_id', body.resource.custom_id);

    if (!error) {
      return new Response('Subscription added successfully', { status: 200 });
    }

    console.error(error);
    return new Response('Error adding subscription', { status: 500 });
  }

  if (body.event_type.startsWith('BILLING.SUBSCRIPTION')) {
    const { error } = await supabase
      .from('plans')
      .update({
        status: body.resource.status,
      })
      .eq('subscription_id', body.resource.id);

    if (!error) {
      return new Response('Subscription updated successfully', { status: 200 });
    }

    console.error(error);
    return new Response('Error updating subscription', { status: 500 });
  }

  return new Response('Event not handled', { status: 200 });
}
