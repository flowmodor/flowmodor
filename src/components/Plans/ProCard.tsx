'use client';

import { Button } from '@nextui-org/button';
import { useState } from 'react';
import usePaddle from '@/hooks/usePaddle';
import { Enums, Tables } from '@/types/supabase';
import Feature from './Feature';

const features = [
  'Everything in Starter',
  'Custom Break Ratio',
  'Todoist Integration',
  'Unlimited Stats',
  'Priority Support',
];

export default function ProCard({ data }: { data: Tables<'plans'> | null }) {
  const [cycle, setCyle] = useState<Enums<'billing_interval'>>(
    data?.billing_interval ?? 'month',
  );
  const isPro =
    data?.plan === 'Pro' &&
    data?.status === 'active' &&
    data?.next_billed_at !== null;

  const { openCheckout } = usePaddle();

  return (
    <div className="flex w-full flex-col gap-10 rounded-xl bg-midground p-10">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl">Pro</h2>
        <div className="flex justify-between">
          <button
            type="button"
            disabled={isPro}
            className={`flex gap-1 flex-col items-center justify-center p-3
              rounded-lg border-2 w-[49%] transition-colors outline-none ${
                cycle === 'month' ? 'border-primary' : 'border-secondary'
              }`}
            onClick={() => setCyle('month')}
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
              cycle === 'year' ? 'border-primary' : 'border-secondary'
            }`}
            onClick={() => setCyle('year')}
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
        <Button
          isDisabled={isPro}
          color="primary"
          radius="sm"
          className="font-semibold text-midground"
          onPress={() => {
            openCheckout(
              cycle === 'month'
                ? process.env.NEXT_PUBLIC_PADDLE_MONTHLY_PLAN_ID
                : process.env.NEXT_PUBLIC_PADDLE_YEARLY_PLAN_ID,
            );
          }}
        >
          {isPro
            ? 'Current plan'
            : `Upgrade to Pro ${cycle === 'month' ? 'Monthly' : 'Yearly'}`}
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
