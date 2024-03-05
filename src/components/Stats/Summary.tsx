import useStatsStore from '@/stores/useStatsStore';
import calculateFocusTimes from '@/utils/stats/calculateFocusTime';
import TimeFormatter from './TimeFormatter';

export default function Summary() {
  const { logs } = useStatsStore((state) => state);
  const { totalFocusTime, longestFocusTime } = calculateFocusTimes(logs ?? []);

  return (
    <div className="flex gap-10">
      <div className="flex flex-col items-center text-sm">
        Total Focus
        <TimeFormatter minutes={Math.round(totalFocusTime)} />
      </div>
      <div className="flex flex-col items-center text-sm">
        Longest Focus
        <TimeFormatter minutes={Math.round(longestFocusTime)} />
      </div>
    </div>
  );
}
