'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { useTasksActions } from '@/hooks/useTasks';
import useTick from '@/hooks/useTick';
import { useStatus } from '@/hooks/useTimer';

export function HomeProvider({ children }: { children: ReactNode }) {
  const { fetchSources, fetchLists, fetchLabels, fetchTasks } =
    useTasksActions();
  const status = useStatus();
  const effectRunRef = useRef(false);

  useEffect(() => {
    if (effectRunRef.current) {
      return;
    }

    effectRunRef.current = true;

    fetchSources();
    fetchLists();
    fetchTasks();
  }, [fetchLists, fetchLabels]);

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
