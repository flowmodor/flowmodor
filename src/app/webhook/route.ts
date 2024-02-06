/* eslint-disable import/prefer-default-export */
import { cookies, headers } from 'next/headers';
import getAccessToken from '@/utils/paypal';
import { getRouteClient } from '@/utils/supabase';

export async function POST(request: Request) {
  const cookieStore = cookies();
  const supabase = getRouteClient(cookieStore);

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
      })
      .eq('user_id', body.resource.custom_id);

    if (!error) {
      return new Response('Subscription created successfully', { status: 200 });
    }

    console.error(error);
    return new Response('Error creating subscription', { status: 500 });
  }

  return new Response('Event not handled', { status: 200 });
}
