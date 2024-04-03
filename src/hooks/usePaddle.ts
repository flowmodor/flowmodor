import { Paddle, initializePaddle } from '@paddle/paddle-js';
import { useEffect, useState } from 'react';
import supabase from '@/utils/supabase';

export default function usePaddle() {
  const [paddle, setPaddle] = useState<Paddle>();

  useEffect(() => {
    initializePaddle({
      environment: process.env.NEXT_PUBLIC_PADDLE_ENV,
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
    }).then((paddleInstance: Paddle | undefined) => {
      if (paddleInstance) {
        setPaddle(paddleInstance);
      }
    });
  }, []);

  const openCheckout = async (priceId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) {
      console.error('User not found');
      return;
    }

    paddle?.Checkout.open({
      settings: {
        allowedPaymentMethods: ['paypal', 'apple_pay', 'google_pay', 'card'],
        theme: 'dark',
        successUrl: `${window.location.origin}/plans?success=Subscribe to the Pro plan successfully`,
      },
      items: [{ priceId, quantity: 1 }],
      customer: {
        email: user?.email ?? '',
      },
      customData: {
        user_id: user.id,
      },
    });
  };

  return {
    openCheckout,
  };
}
