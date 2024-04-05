'use client';

import { Card } from '@nextui-org/card';
import { useLogs } from '@/stores/useStatsStore';
import calculateFocusTimes from '@/utils/stats/calculateFocusTime';
import TimeFormatter from './TimeFormatter';

export default function Summary() {
  const logs = useLogs();
  const { totalFocusTime, longestFocusTime } = calculateFocusTimes(logs ?? []);

  return (
    <Card
      radius="sm"
      className="flex flex-row justify-center w-full gap-10 bg-midground p-5"
    >
      <div className="flex flex-col items-center text-sm">
        Total Focus
        <TimeFormatter minutes={Math.round(totalFocusTime)} />
      </div>
      <div className="flex flex-col items-center text-sm">
        Longest Focus
        <TimeFormatter minutes={Math.round(longestFocusTime)} />
      </div>
    </Card>
  );
}
