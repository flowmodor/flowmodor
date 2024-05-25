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
    <div className="flex flex-col gap-10 mt-16 mb-5 mx-5">
      <div className="flex flex-col sm:flex-row justify-between gap-10">
        <div className="flex flex-col gap-2 flex-wrap">
          <h1 className="text-3xl font-semibold">Feedback</h1>
          <div>
            Let us know how we can improve. Vote on existing ideas or suggest
            new ones.
          </div>
        </div>
        <SuggestButton user={user} />
      </div>
      <div className="flex flex-col bg-midground rounded-lg gap-6 p-5">
        {features &&
          features.map((feature, index) => (
            <div key={feature.id} className="flex flex-col gap-6">
              <Feature feature={feature} />
              {index < features.length - 1 && (
                <hr className="border-secondary" />
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
