'use client';

import { Button } from '@nextui-org/button';
import Link from 'next/link';
import { useState } from 'react';
import Feature from './Feature';

const features = [
  'Everything in Starter',
  'Custom Break Ratio',
  'Unlimited Stats',
  'Priority Support',
];

export type Cycle = 'Monthly' | 'Yearly';

export default function ProCard({
  status,
  planId,
}: {
  status: any;
  planId: string;
}) {
  const [cycle, setCyle] = useState<Cycle>(
    planId === process.env.NEXT_PUBLIC_PAYPAL_MONTHLY_PLAN_ID
      ? 'Monthly'
      : 'Yearly',
  );

  return (
    <div className="flex w-full flex-col gap-10 rounded-xl bg-[#23223C] p-10 lg:w-2/5">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl">Pro</h2>
        <div className="flex justify-between">
          <button
            type="button"
            disabled={status === 'ACTIVE'}
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
            <div className="font-semibold">Monthly</div>
          </button>
          <button
            type="button"
            disabled={status === 'ACTIVE'}
            className={`flex gap-1 flex-col items-center justify-center p-3 rounded-lg border-2 w-[49%] transition-colors outline-none ${
              cycle === 'Yearly' ? 'border-primary' : 'border-secondary'
            }`}
            onClick={() => setCyle('Yearly')}
          >
            <div className="flex items-end gap-1">
              <h2 className="text-4xl font-semibold">$4</h2>
              <div className="text-sm opacity-50">/ month</div>
            </div>
            <div className="font-semibold">Yearly</div>
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
          isDisabled={status === 'ACTIVE'}
          as={Link}
          href={`/plans/upgrade?cycle=${cycle.toLowerCase()}`}
          color="primary"
          radius="sm"
          className="font-semibold text-[#23223C]"
        >
          {status === 'ACTIVE' ? 'Current plan' : `Upgrade to Pro ${cycle}`}
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
