import { Metadata } from 'next';
import { cookies } from 'next/headers';
import Feature from '@/components/Feedback/Feature';
import SuggestButton from '@/components/Feedback/SuggestButton';
import { getServerClient } from '@/utils/supabase';

export const metadata: Metadata = {
  title: 'Feedback | Flowmodor',
};

export default async function FeedbackPage() {
  const supabase = getServerClient(cookies());
  const { data: features } = await supabase
    .from('features')
    .select('*')
    .order('upvotes', { ascending: false })
    .order('created_at', { ascending: false });

  return (
    <div className="flex flex-col gap-5 mt-16 mb-5">
      <div className="flex justify-between">
        <h1 className="text-3xl font-semibold">Feedback</h1>
        <SuggestButton />
      </div>
      <div className="flex flex-col gap-5">
        {features &&
          features.map((feature) => (
            <Feature key={feature.id} feature={feature} />
          ))}
      </div>
    </div>
  );
}
