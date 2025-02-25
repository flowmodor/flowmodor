import NumberFlow, { NumberFlowGroup } from '@number-flow/react';
import { useMode } from '@/hooks/useTimer';

type Props = {
  hours?: number;
  minutes: number;
  seconds: number;
};

export default function TimeDisplay({ hours, minutes, seconds }: Props) {
  const mode = useMode();
  const trend = mode === 'focus' ? 1 : -1;
  const showHours = typeof hours !== 'undefined' && hours > 0;

  return (
    <NumberFlowGroup>
      <div
        className={`${showHours ? 'text-4xl' : 'text-5xl'} flex items-baseline font-semibold tabular-nums`}
      >
        {typeof hours !== 'undefined' && (
          <NumberFlow
            trend={trend}
            value={hours}
            format={{ minimumIntegerDigits: 2 }}
          />
        )}

        <NumberFlow
          {...(showHours ? { prefix: ':' } : {})}
          trend={trend}
          value={minutes}
          digits={{ 1: { max: 5 } }}
          format={{ minimumIntegerDigits: 2 }}
        />
        <NumberFlow
          prefix=":"
          trend={trend}
          value={seconds}
          digits={{ 1: { max: 5 } }}
          format={{ minimumIntegerDigits: 2 }}
        />
      </div>
    </NumberFlowGroup>
  );
}
