'use client';

import { useEffect } from 'react';
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';

function ButtonWrapper({ type }: { type: any }) {
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

  return (
    <PayPalButtons
      createSubscription={(data, actions) =>
        actions.subscription
          .create({
            plan_id: process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID,
          })
          .then((orderId) => {
            console.log(orderId);
            return orderId;
          })
      }
      style={{
        label: 'subscribe',
        color: 'silver',
      }}
    />
  );
}

export default function Upgrade() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5">
      <div className="text-2xl font-semibold">Upgrade to Pro</div>
      <PayPalScriptProvider
        options={{
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
          components: 'buttons',
          intent: 'subscription',
          vault: true,
        }}
      >
        <div className="rounded-md bg-white p-5">
          <ButtonWrapper type="subscription" />
        </div>
      </PayPalScriptProvider>
    </div>
  );
}
