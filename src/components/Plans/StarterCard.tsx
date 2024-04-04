import { cookies } from 'next/headers';
import { getServerClient } from '@/utils/supabase';
import Feature from './Feature';
import StarterButton from './StarterButton';

const features = ['Flowmodoro Timer', 'Task List', 'Today Stats'];

export default async function StarterCard({ isPro }: { isPro: boolean }) {
  const supabase = getServerClient(cookies());
  const { data } = await supabase
    .from('plans')
    .select('next_billed_at')
    .single();

  return (
    <div className="flex w-full flex-col gap-10 rounded-xl bg-[#23223C] p-10">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl">Starter</h2>
        <div className="flex items-end gap-1">
          <h2 className="text-4xl font-semibold">$0</h2>
          <div className="text-sm opacity-50">/ forever</div>
        </div>
      </div>
      <StarterButton
        isPro={isPro}
        isDisabled={(isPro && !data?.next_billed_at) || !isPro}
      />
      <ul>
        {features.map((feature) => (
          <Feature key={feature} feature={feature} />
        ))}
      </ul>
    </div>
  );
}
