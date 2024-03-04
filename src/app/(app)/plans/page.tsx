import { Chip } from '@nextui-org/chip';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import GoHome from '@/components/GoHome';
import ProCard from '@/components/Plans/ProCard';
import StarterCard from '@/components/Plans/StarterCard';
import { getPlan } from '@/utils/checkIsPro';

export const metadata: Metadata = {
  title: 'Plans | Flowmodor',
};

export default async function Plans() {
  const cookieStore = cookies();
  const { status, endTime, id, planId } = await getPlan(cookieStore);

  return (
    <div className="mt-20 flex w-[90vw] flex-col gap-10 mb-10">
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
      <div className="flex flex-col items-center justify-center gap-10 lg:flex-row lg:items-stretch">
        <StarterCard status={status} id={id} />
        <ProCard status={status} planId={planId} />
      </div>
    </div>
  );
}
