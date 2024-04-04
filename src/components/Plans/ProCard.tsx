'use client';

import { Button } from '@nextui-org/button';
import { useState } from 'react';
import usePaddle from '@/hooks/usePaddle';
import Feature from './Feature';

const features = [
  'Everything in Starter',
  'Custom Break Ratio',
  'Unlimited Stats',
  'Priority Support',
];

export type Cycle = 'Monthly' | 'Yearly';

export default function ProCard({ isPro }: { isPro: boolean }) {
  // TODO: get billing cycle
  const [cycle, setCyle] = useState<Cycle>('Yearly');

  const { openCheckout } = usePaddle();

  return (
    <div className="flex w-full flex-col gap-10 rounded-xl bg-[#23223C] p-10">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl">Pro</h2>
        <div className="flex justify-between">
          <button
            type="button"
            disabled={isPro}
            className={`flex gap-1 flex-col items-center justify-center p-3
              rounded-lg border-2 w-[49%] transition-colors outline-none ${
                cycle === 'Monthly' ? 'border-primary' : 'border-secondary'
              }`}
            onClick={() => setCyle('Monthly')}
          >
            <div className="flex items-end gap-1">
              <h2 className="text-4xl font-semibold">$5</h2>
              <div className="text-sm opacity-50">/ month</div>
            </div>
            <div className="text-xs">+ VAT if applicable</div>
          </button>
          <button
            type="button"
            disabled={isPro}
            className={`flex gap-1 flex-col items-center justify-center p-3 rounded-lg border-2 w-[49%] transition-colors outline-none ${
              cycle === 'Yearly' ? 'border-primary' : 'border-secondary'
            }`}
            onClick={() => setCyle('Yearly')}
          >
            <div className="flex items-end gap-1">
              <h2 className="text-4xl font-semibold">$48</h2>
              <div className="text-sm opacity-50">/ year</div>
            </div>
            <div className="text-xs">+ VAT if applicable</div>
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-sm">
          You&apos;ll be charged{' '}
          <span className="font-semibold">
            {cycle === 'Monthly' ? '$5 per month' : '$48 per year'}.
          </span>
        </div>
        <Button
          isDisabled={isPro}
          color="primary"
          radius="sm"
          className="font-semibold text-[#23223C]"
          onPress={() => {
            openCheckout(
              cycle === 'Monthly'
                ? process.env.NEXT_PUBLIC_PADDLE_MONTHLY_PLAN_ID
                : process.env.NEXT_PUBLIC_PADDLE_YEARLY_PLAN_ID,
            );
          }}
        >
          {isPro ? 'Current plan' : `Upgrade to Pro ${cycle}`}
        </Button>
      </div>
      <ul>
        {features.map((feature) => (
          <Feature key={feature} feature={feature} />
        ))}
      </ul>
    </div>
  );
}
