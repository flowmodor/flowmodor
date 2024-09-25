'use client';

import { Button } from '@nextui-org/button';
import { useTransition } from 'react';
import { Hide, Pause, Play, Show, Stop } from '@/components/Icons';
import { useActiveList, useFocusingTask } from '@/stores/Tasks';
import {
  useMode,
  useShowTime,
  useStatus,
  useTimerActions,
} from '@/stores/useTimerStore';
import TooltipWrapper from './TooltipWrapper';

export default function Toolbar() {
  const showTime = useShowTime();
  const status = useStatus();
  const mode = useMode();

  const { startTimer, stopTimer, pauseTimer, resumeTimer, toggleShowTime } =
    useTimerActions();
  const [isLoading, startTransition] = useTransition();
  const focusingTask = useFocusingTask();
  const activeList = useActiveList();

  return (
    <div className="flex items-center justify-center gap-5">
      {status !== 'idle' && (
        <Button
          type="button"
          variant="flat"
          isIconOnly
          aria-label={showTime ? 'Hide time' : 'Show time'}
          className="bg-secondary"
          onPress={toggleShowTime}
        >
          {showTime ? <Hide /> : <Show />}
        </Button>
      )}
      {mode === 'focus' && (status === 'running' || status === 'paused') ? (
        <Button
          type="button"
          variant="flat"
          isLoading={isLoading}
          isIconOnly
          aria-label={status === 'running' ? 'Pause' : 'Resume'}
          className="bg-secondary"
          onPress={() => {
            startTransition(async () => {
              if (status === 'running') {
                await pauseTimer(focusingTask, activeList);
              } else {
                await resumeTimer();
              }
            });
          }}
        >
          {status === 'running' ? <Pause /> : <Play />}
        </Button>
      ) : null}
      <TooltipWrapper>
        <Button
          id="start-stop-button"
          type="button"
          variant="flat"
          isLoading={isLoading}
          isIconOnly
          aria-label={status === 'idle' ? 'Start' : 'Stop'}
          className="bg-secondary"
          onPress={() => {
            startTransition(async () => {
              if (status !== 'idle') {
                await stopTimer(focusingTask, activeList);
              } else {
                await startTimer();
              }
            });
          }}
        >
          {status === 'idle' ? <Play /> : <Stop />}
        </Button>
      </TooltipWrapper>
    </div>
  );
}
