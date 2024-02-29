import { Button } from '@nextui-org/button';
import { Chip } from '@nextui-org/chip';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';
import GoHome from '@/components/GoHome';
import Menu from '@/components/Menu';
import PlanCard from '@/components/Plans/PlanCard';
import StarterButton from '@/components/Plans/StarterButton';
import { getPlan } from '@/utils/checkIsPro';

export const metadata: Metadata = {
  title: 'Plans | Flowmodor',
};

export default async function Plans() {
  const cookieStore = cookies();
  const { status, endTime, id } = await getPlan(cookieStore);

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
