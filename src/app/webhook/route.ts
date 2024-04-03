/* eslint-disable import/prefer-default-export */
import { EventName } from '@paddle/paddle-node-sdk';
import { headers } from 'next/headers';
import validateSignature from '@/utils/paddle';

export async function POST(request: Request) {
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

  try {
    switch (parsedBody.event_type) {
      case EventName.SubscriptionCreated:
        console.log(`Subscription ${parsedBody.data.id} was created`);
        break;
      case EventName.SubscriptionActivated:
        console.log(`Subscription ${parsedBody.data.id} was activated`);
        break;
      case EventName.SubscriptionCanceled:
        console.log(`Subscription ${parsedBody.data.id} was canceled`);
        break;
      default:
        console.log(parsedBody.eventType);
    }
  } catch (error) {
    console.log(error);
  }

  return new Response('Processed webhook event', { status: 200 });
}
