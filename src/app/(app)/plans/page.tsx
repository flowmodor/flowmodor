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
    <div className="flex mx-10 w-full py-10 h-max lg:h-auto lg:w-[80vw] xl:w-[70vw] flex-col gap-5">
      <div className="flex flex-col items-center justify-center gap-10 lg:flex-row lg:items-stretch">
        <StarterCard isPro={isPro} />
        <ProCard isPro={isPro} />
      </div>
      {data && data.subscription_id ? <Subscriptions data={data} /> : null}
    </div>
  );
}
