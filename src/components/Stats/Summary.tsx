import { Card } from '@nextui-org/card';
import useStatsStore from '@/stores/useStatsStore';
import calculateFocusTimes from '@/utils/stats/calculateFocusTime';
import TimeFormatter from './TimeFormatter';

export default function Summary({ isBlocked }: { isBlocked: boolean }) {
  const { logs } = useStatsStore((state) => state);
  const { totalFocusTime, longestFocusTime } = calculateFocusTimes(logs ?? []);

  return (
    <Card
      radius="sm"
      className="flex flex-row justify-center w-full gap-10 bg-[#23223C] p-5"
    >
      <div className="flex flex-col items-center text-sm">
        Total Focus
        <TimeFormatter minutes={isBlocked ? 0 : Math.round(totalFocusTime)} />
      </div>
      <div className="flex flex-col items-center text-sm">
        Longest Focus
        <TimeFormatter minutes={isBlocked ? 0 : Math.round(longestFocusTime)} />
      </div>
    </Card>
  );
}
