'use client';

import { ReactNode, useEffect, useRef } from 'react';
import useTick from '@/hooks/useTick';
import { useTasksActions } from '@/stores/useTasksStore';
import { useStatus } from '@/stores/useTimerStore';

// eslint-disable-next-line import/prefer-default-export
export function HomeProvider({ children }: { children: ReactNode }) {
  const { fetchListsAndLabels, fetchTasks } = useTasksActions();
  const status = useStatus();
  const effectRunRef = useRef(false);

  useEffect(() => {
    if (effectRunRef.current) {
      return;
    }

    effectRunRef.current = true;

    (async () => {
      await fetchListsAndLabels();
      await fetchTasks();
    })();
  }, [fetchListsAndLabels]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (status === 'idle') {
        return;
      }

      e.preventDefault();
      e.returnValue = true;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [status]);

  useTick();

  return children;
}
