import { CircularProgress } from '@nextui-org/progress';
import { formatTime } from '@/utils';
import useTimerStore from '@/stores/useTimerStore';

export default function Progress() {
  const { totalTime, displayTime, mode, showTime } = useTimerStore(
    (state) => state,
  );

  return (
    <CircularProgress
      value={
        mode === 'focus'
          ? 0
          : 100 * (displayTime / Math.floor(totalTime! / 1000))
      }
      size="lg"
      showValueLabel
      aria-label="Timer progress"
      valueLabel={
        <div className="flex flex-col items-center gap-2">
          {showTime ? formatTime(displayTime) : '**:**'}
          <span className="text-2xl">
            {mode === 'focus' ? 'Focus' : 'Break'}
          </span>
        </div>
      }
      classNames={{
        svg: 'w-80 h-80 text-primary',
        track: 'stroke-secondary',
        value: 'text-5xl font-semibold',
      }}
    />
  );
}
