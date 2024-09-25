import { Tooltip } from '@nextui-org/tooltip';
import { ReactNode } from 'react';
import {
  useBreakRatio,
  useDisplayTime,
  useMode,
  useStatus,
} from '@/stores/useTimerStore';
import { formatTime } from '@/utils';

export default function TooltipWrapper({ children }: { children: ReactNode }) {
  const mode = useMode();
  const status = useStatus();
  const displayTime = useDisplayTime();
  const breakRatio = useBreakRatio();

  if (mode !== 'focus' || status === 'idle') {
    return children;
  }

  return (
    <Tooltip
      placement="bottom"
      color="primary"
      offset={12}
      content={`Break Time: ${formatTime(
        displayTime,
      )} ÷ ${breakRatio} = ${formatTime(displayTime / breakRatio)}`}
    >
      {children}
    </Tooltip>
  );
}
