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
  const [isStopLoading, startStopTransition] = useTransition();
  const [isPauseLoading, startPauseTransition] = useTransition();
  const focusingTask = useFocusingTask();
  const activeList = useActiveList();

  return (
    <div className="flex items-center justify-center gap-5">
      {status !== 'idle' && (
        <Button
          type="button"
          radius="lg"
          variant="flat"
          isIconOnly
          disableRipple
          aria-label={showTime ? 'Hide time' : 'Show time'}
          className="bg-secondary w-12 h-12"
          onPress={toggleShowTime}
        >
          {showTime ? <Hide /> : <Show />}
        </Button>
      )}
      <TooltipWrapper>
        <Button
          id="start-stop-button"
          type="button"
          radius="lg"
          variant="flat"
          isLoading={isStopLoading}
          isDisabled={isPauseLoading}
          isIconOnly
          disableRipple
          aria-label={status === 'idle' ? 'Start' : 'Stop'}
          className="bg-secondary w-12 h-12"
          onPress={() => {
            startStopTransition(async () => {
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
      {mode === 'focus' && (status === 'running' || status === 'paused') ? (
        <Button
          type="button"
          variant="flat"
          radius="lg"
          isLoading={isPauseLoading}
          isDisabled={isStopLoading}
          isIconOnly
          disableRipple
          aria-label={status === 'running' ? 'Pause' : 'Resume'}
          className="bg-secondary w-12 h-12"
          onPress={() => {
            startPauseTransition(async () => {
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
    </div>
  );
}
