import { Metadata } from 'next';
import { cookies } from 'next/headers';
import Feature from '@/components/Feedback/Feature';
// import Feedback from '@/components/Feedback';
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
    <div className="mt-20 bg-midground p-3 flex flex-col gap-5">
      {features &&
        features.map((feature) => (
          <Feature key={feature.id} feature={feature} />
        ))}
    </div>
  );
}
