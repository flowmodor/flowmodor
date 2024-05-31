'use client';

import { ReactNode, useEffect, useRef } from 'react';
import useTick from '@/hooks/useTick';
import { useTasksActions } from '@/stores/Tasks';

// eslint-disable-next-line import/prefer-default-export
export function HomeProvider({ children }: { children: ReactNode }) {
  const { fetchListsAndLabels } = useTasksActions();
  const effectRunRef = useRef(false);

  useEffect(() => {
    if (effectRunRef.current) {
      return;
    }

    effectRunRef.current = true;
    fetchListsAndLabels();
  }, [fetchListsAndLabels]);

  useTick();

  return children;
}
