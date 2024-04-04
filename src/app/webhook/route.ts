/* eslint-disable import/prefer-default-export */
import { EventName } from '@paddle/paddle-node-sdk';
import { cookies, headers } from 'next/headers';
import validateSignature from '@/utils/paddle';
import { getRouteClient } from '@/utils/supabase';

export async function POST(request: Request) {
  try {
    const rawRequestBody = await request.text();
    const signature = (headers().get('paddle-signature') as string) || '';

    const isValid = await validateSignature(
      signature,
      rawRequestBody,
      process.env.PADDLE_SECRET_KEY,
    );

    if (!isValid) {
      return new Response('Invalid signature', { status: 401 });
    }

    const parsedBody = JSON.parse(rawRequestBody);
    const supabase = getRouteClient(cookies());

    switch (parsedBody.event_type) {
      case EventName.SubscriptionActivated:
      case EventName.SubscriptionUpdated:
      case EventName.SubscriptionCanceled: {
        const { error } = await supabase
          .from('plans')
          .update({
            subscription_id: parsedBody.data.id,
            status: parsedBody.data.status,
            plan: parsedBody.data.items[0].price.name,
            end_time: parsedBody.data.current_billing_period?.ends_at ?? null,
            next_billed_at: parsedBody.data.next_billed_at,
          })
          .eq('user_id', parsedBody.data.custom_data.user_id);

        if (error) {
          console.log(error);
        }

        break;
      }
      default:
        console.log(parsedBody.eventType);
    }
  } catch (error) {
    console.log(error);
    return new Response('Error processing webhook event', { status: 500 });
  }

  return new Response('Processed webhook event', { status: 200 });
}
