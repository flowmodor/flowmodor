'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getActionClient } from '@/utils/supabase';

// eslint-disable-next-line import/prefer-default-export
export async function cancelSubscription() {
  const supabase = getActionClient(cookies());
  const { data } = await supabase
    .from('plans')
    .select('subscription_id')
    .single();

  try {
    if (!data?.subscription_id) {
      throw new Error('No subscription found.');
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PADDLE_API_URL}/subscriptions/${data.subscription_id}/cancel`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
        method: 'POST',
      },
    );

    if (!response.ok) {
      throw new Error('Error cancelling subscription. Please try again.');
    }
  } catch (error) {
    console.error(error);
    redirect('/plans?error=Error cancelling subscription.');
  }

  redirect('/plans?success=Subscription cancelled successfully.');
}
