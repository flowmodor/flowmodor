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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col gap-10 mt-16 mb-5">
      <div className="flex justify-between gap-10">
        <div className="flex flex-col gap-2 flex-wrap">
          <h1 className="text-3xl font-semibold">Feature Requests</h1>
          <div>
            Let us know how we can improve. Vote on existing ideas or suggest
            new ones.
          </div>
        </div>
        <SuggestButton user={user} />
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
