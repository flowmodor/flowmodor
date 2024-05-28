'use client';

/* eslint-disable @typescript-eslint/naming-convention */
import { Link } from '@nextui-org/link';
import { useEffect, useRef, useState } from 'react';
import supabase from '@/utils/supabase';

export default function TrialBanner() {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const effectRunRef = useRef(false);

  useEffect(() => {
    if (effectRunRef.current) {
      return;
    }
    effectRunRef.current = true;

    (async () => {
      const { data, error } = await supabase
        .from('plans')
        .select('status,end_time')
        .single();

      if (error) {
        return;
      }

      const { status, end_time } = data;

      if (
        status === 'trialing' &&
        end_time &&
        new Date(end_time) >= new Date()
      ) {
        setDaysLeft(
          Math.ceil(
            (new Date(end_time).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
          ),
        );
      }
    })();
  }, []);

  if (daysLeft === null) {
    return null;
  }

  return (
    <div className="flex-shrink-0 border-b border-b-secondary bg-midground w-full left-0 h-12 flex items-center justify-center gap-2">
      Your free trial is {daysLeft} day{daysLeft > 1 ? 's' : ''} left.
      <Link href="/plans" underline="always">
        Upgrade now
      </Link>
    </div>
  );
}
