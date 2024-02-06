import { cookies } from 'next/headers';
import Link from 'next/link';
import { Button } from '@nextui-org/button';
import { Chip } from '@nextui-org/chip';

import StarterButton from '@/components/Plans/StarterButton';
import Menu from '@/components/Menu';
import GoHome from '@/components/GoHome';
import PlanCard from '@/components/Plans/PlanCard';
import { getServerClient } from '@/utils/supabase';
import getAccessToken from '@/utils/paypal';

export default async function Plans() {
  const supabase = getServerClient(cookies());
  const { data } = await supabase
    .from('plans')
    .select('end_time, subscription_id')
    .single();
  const id = data?.subscription_id;

  let status = null;
  let endTime = null;

  try {
    const accessToken = await getAccessToken();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PAYPAL_API_URL}/billing/subscriptions/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch subscription');
    }

    const subscription = await response.json();
    status = subscription.status;
    endTime = subscription?.billing_info?.next_billing_time;
    if (endTime) {
      supabase.from('plans').update({ end_time: endTime }).single();
    } else {
      endTime = data?.end_time;
    }
  } catch (error) {
    console.error(error);
  }

  const starter = ['Flowmodoro Timer', 'Task List', 'Today Stats'];
  const pro = [
    'Everything in Starter',
    'Custom Break Ratio',
    'Unlimited Stats',
    'Priority Support',
  ];

  return (
    <>
      <Menu />
      <div className="mt-20 flex w-[90vw] flex-col gap-10">
        <div className="mx-auto flex flex-col gap-2 sm:w-4/5 lg:w-2/3">
          <div className="flex items-center gap-3 text-3xl font-semibold">
            <GoHome />
            Plans
          </div>
          {status ? (
            <>
              <div className="flex items-center gap-2">
                Status:
                <Chip size="sm" color="primary">
                  {status}
                </Chip>
              </div>
              <div>End Time: {new Date(endTime).toLocaleString()}</div>
            </>
          ) : null}
        </div>
        <div className="flex flex-col items-center justify-center gap-10 sm:flex-row sm:items-stretch">
          <PlanCard name="Starter" price={0} features={starter}>
            <StarterButton status={status} id={id ?? ''} />
          </PlanCard>
          <PlanCard name="Pro" price={5} features={pro}>
            <Button
              isDisabled={status === 'ACTIVE'}
              as={Link}
              href="/plans/upgrade"
              color="primary"
              radius="sm"
              className="font-semibold text-[#23223C]"
            >
              {status === 'ACTIVE' ? 'Current plan' : 'Upgrade to Pro'}
            </Button>
          </PlanCard>
        </div>
      </div>
    </>
  );
}
