'use client';

import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import GoHome from '@/components/GoHome';
import { Cycle } from '@/components/Plans/ProCard';
import supabase from '@/utils/supabase';

function ButtonWrapper({
  type,
  userId,
  cycle,
}: {
  type: string;
  userId: string | undefined;
  cycle: string;
}) {
  const router = useRouter();
  const [{ options }, dispatch] = usePayPalScriptReducer();

  useEffect(() => {
    dispatch({
      type: 'resetOptions',
      value: {
        ...options,
        intent: 'subscription',
      },
    });
  }, [type]);

  if (!userId) {
    return null;
  }

  return (
    <PayPalButtons
      createSubscription={(data, actions) =>
        actions.subscription
          .create({
            ...(cycle === 'yearly'
              ? {
                  plan_id: process.env.NEXT_PUBLIC_PAYPAL_YEARLY_PLAN_ID,
                }
              : {
                  plan_id: process.env.NEXT_PUBLIC_PAYPAL_MONTHLY_PLAN_ID,
                }),
            custom_id: userId,
          })
          .then((orderId) => orderId)
      }
      onApprove={async () => {
        toast('Subscribed to Pro successfully!');
        router.push('/plans');
      }}
      style={{
        label: 'subscribe',
        color: 'silver',
      }}
    />
  );
}

export default function Upgrade({
  searchParams,
}: {
  searchParams: { cycle: Cycle };
}) {
  const [userId, setUserId] = useState<string | undefined>();
  const { cycle } = searchParams;

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUserId(user?.id);
    })();
  }, []);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-5">
      <div className="flex items-center gap-3 text-2xl font-semibold">
        <GoHome href="/plans" />
        Upgrade to Pro
      </div>
      <PayPalScriptProvider
        options={{
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
          components: 'buttons',
          intent: 'subscription',
          vault: true,
        }}
      >
        <div className="rounded-md bg-white p-5">
          <ButtonWrapper type="subscription" userId={userId} cycle={cycle} />
        </div>
      </PayPalScriptProvider>
    </div>
  );
}
