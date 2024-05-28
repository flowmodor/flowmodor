'use client';

import { Link } from '@nextui-org/link';
import { useEffect, useRef, useState } from 'react';

export default function TrialBanner({ data }: { data: any }) {
  const [daysLeft, setDaysLeft] = useState<number>(0);
  const effectRunRef = useRef(false);

  useEffect(() => {
    if (effectRunRef.current) {
      return;
    }
    effectRunRef.current = true;

    setDaysLeft(
      Math.ceil(
        (new Date(data.end_time).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24),
      ),
    );
  }, [data.end_time]);

  if (
    data?.status === 'trialing' &&
    data?.end_time &&
    new Date(data.end_time) >= new Date()
  ) {
    return (
      <div className="flex-shrink-0 border-b border-b-secondary bg-midground w-full left-0 h-12 flex items-center justify-center gap-2">
        Your free trial is {daysLeft} day{daysLeft > 1 ? 's' : ''} left.
        <Link href="/plans" underline="always">
          Upgrade now
        </Link>
      </div>
    );
  }

  return null;
}
