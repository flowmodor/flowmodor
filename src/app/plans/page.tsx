import { cookies } from 'next/headers';
import Link from 'next/link';
import { Button } from '@nextui-org/button';
import { Chip } from '@nextui-org/react';

import StarterButton from '@/components/Plans/StarterButton';
import Menu from '@/components/Menu';
import GoHome from '@/components/GoHome';
import { getServerClient } from '@/utils/supabase';
import PlanCard from '@/components/Plans/PlanCard';

export default async function Plans() {
  const supabase = getServerClient(cookies());
  const { data } = await supabase.from('plans').select('*').single();

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
          {data?.status ? (
            <>
              <div className="flex items-center gap-2">
                Status:
                <Chip size="sm" color="primary">
                  {data.status}
                </Chip>
                (takes a few minutes to update)
              </div>
              <div>End Time: {new Date(data.end_time).toLocaleString()}</div>
            </>
          ) : null}
        </div>
        <div className="flex flex-col items-center justify-center gap-10 sm:flex-row sm:items-stretch">
          <PlanCard name="Starter" price={0} features={starter}>
            <StarterButton data={data} />
          </PlanCard>
          <PlanCard name="Pro" price={5} features={pro}>
            <Button
              isDisabled={data?.status === 'ACTIVE'}
              as={Link}
              href="/plans/upgrade"
              color="primary"
              radius="sm"
              className="font-semibold text-[#23223C]"
            >
              {data?.status === 'ACTIVE' ? 'Current plan' : 'Upgrade to Pro'}
            </Button>
          </PlanCard>
        </div>
      </div>
    </>
  );
}
