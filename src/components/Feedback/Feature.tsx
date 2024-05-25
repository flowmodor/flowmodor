import { cookies } from 'next/headers';
import Markdown from 'react-markdown';
import { getServerClient } from '@/utils/supabase';
import UpvoteButton from './UpvoteButton';

export default async function Feature({ feature }: { feature: any }) {
  const supabase = getServerClient(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: vote } = await supabase
    .from('votes')
    .select('*')
    .eq('user_id', user?.id)
    .eq('feature_id', feature.id)
    .single();

  return (
    <div className="flex gap-4">
      <UpvoteButton
        upvoted={!!vote}
        upvotes={feature.upvotes}
        featureId={feature.id}
      />
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">{feature.title}</h2>
        <div className="prose prose-invert prose-sm">
          <Markdown>{feature.description}</Markdown>
        </div>
      </div>
    </div>
  );
}
