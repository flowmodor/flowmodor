import { Metadata } from 'next';
import { cookies } from 'next/headers';
import ProCard from '@/components/Plans/ProCard';
import StarterCard from '@/components/Plans/StarterCard';
import checkIsPro from '@/utils/checkIsPro';

export const metadata: Metadata = {
  title: 'Plans | Flowmodor',
};

export default async function Plans() {
  const cookieStore = cookies();
  const isPro = await checkIsPro(cookieStore);

  return (
    <div className="mt-20 flex w-[90vw] flex-col gap-10 mb-10">
      <div className="flex mx-5 flex-col items-center justify-center gap-10 lg:flex-row lg:items-stretch">
        <StarterCard isPro={isPro} />
        <ProCard isPro={isPro} />
      </div>
    </div>
  );
}
