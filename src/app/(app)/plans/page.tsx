import { Metadata } from 'next';
import { cookies } from 'next/headers';
import ProCard from '@/components/Plans/ProCard';
import StarterCard from '@/components/Plans/StarterCard';
import Subscriptions from '@/components/Plans/Subscriptions';
import checkIsPro from '@/utils/checkIsPro';
import { getServerClient } from '@/utils/supabase';

export const metadata: Metadata = {
  title: 'Plans | Flowmodor',
};

export default async function Plans() {
  const cookieStore = cookies();
  const isPro = await checkIsPro(cookieStore);

  const supabase = getServerClient(cookies());
  const { data } = await supabase.from('plans').select('*').single();

  return (
    <div className="mt-20 flex w-[90vw] flex-col gap-10 mb-10">
      {data && data.subscription_id ? <Subscriptions data={data} /> : null}
      <div className="flex mx-5 flex-col items-center justify-center gap-10 lg:flex-row lg:items-stretch">
        <StarterCard isPro={isPro} />
        <ProCard isPro={isPro} />
      </div>
    </div>
  );
}
