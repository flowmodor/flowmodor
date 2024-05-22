'use client';

import { Button } from '@nextui-org/react';
import { useTransition } from 'react';
import { unVote, vote } from '@/actions/feedback';
import { Upvote } from '../Icons';

export default function UpvoteButton({
  upvoted,
  upvotes,
  featureId,
}: {
  upvoted: boolean;
  upvotes: number;
  featureId: number;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      isIconOnly
      disableRipple
      isLoading={isPending}
      className={`bg-midground w-14 h-14 rounded-md flex-shrink-0 fill-white ${
        upvoted ? 'border-2 border-primary fill-primary text-primary' : ''
      }`}
      onPress={() => {
        startTransition(async () => {
          if (upvoted) {
            unVote(featureId);
          } else {
            vote(featureId);
          }
        });
      }}
    >
      <div className="flex flex-col items-center">
        <Upvote />
        {upvotes}
      </div>
    </Button>
  );
}
