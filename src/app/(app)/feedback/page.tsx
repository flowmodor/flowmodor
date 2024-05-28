import { Metadata } from 'next';
import { cookies } from 'next/headers';
import Features from '@/components/Feedback/Features';
import Tabs from '@/components/Feedback/Tabs';
import { getServerClient } from '@/utils/supabase';

export const metadata: Metadata = {
  title: 'Feedback | Flowmodor',
};

export default async function FeedbackPage() {
  const supabase = getServerClient(cookies());
  const { data: features } = await supabase.from('features').select('*');

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
      </div>
      <Tabs user={user}>
        <Features
          features={
            features?.toSorted((a, b) =>
              a.upvotes === b.upvotes
                ? new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
                : b.upvotes - a.upvotes,
            ) ?? []
          }
        />
        <Features
          features={
            features?.toSorted(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime(),
            ) ?? []
          }
        />
      </Tabs>
    </div>
  );
}
