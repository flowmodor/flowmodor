'use client';

import { Tables } from '@flowmodor/types';
import { Card, CardBody } from '@nextui-org/card';
import { calculateStreaks } from '@/utils/stats/calculateStreaks';
import Heatmap from './Heatmap';

const calculateFocusTime = (data: Tables<'logs'>[]) => {
  const focusTimeMap: { [key: string]: number } = {};

  data.forEach((item) => {
    const date = new Date(item.start_time).toLocaleDateString('en-CA');
    const startTime = new Date(item.start_time).getTime();
    const endTime = new Date(item.end_time).getTime();
    const focusTimeInHours = (endTime - startTime) / (1000 * 60 * 60);
    if (focusTimeMap[date]) {
      focusTimeMap[date] += focusTimeInHours;
    } else {
      focusTimeMap[date] = focusTimeInHours;
    }
  });

  const thresholds = [3, 2, 1, 25 / 60, 0];

  return Object.keys(focusTimeMap).map((date) => ({
    date,
    count: focusTimeMap[date],
    level: 4 - thresholds.findIndex((t) => focusTimeMap[date] >= t),
  }));
};

export default function YearlyStats({ data }: { data: Tables<'logs'>[] }) {
  const focusTimeData = calculateFocusTime(data);
  const { currentStreak, longestStreak } = calculateStreaks(focusTimeData);

  return (
    <Card radius="sm" className="shrink-0 flex flex-col bg-midground w-full">
      <CardBody className="flex flex-col gap-4 lg:flex-row lg:gap-8">
        <div className="flex flex-row lg:flex-col justify-center gap-10 lg:gap-6 shrink-0">
          <div className="flex flex-col items-center">
            <div className="text-sm">Longest Streak</div>
            <div className="flex items-end gap-1">
              <div className="text-2xl font-semibold">{longestStreak}</div>
              days
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-sm">Current Streak</div>
            <div className="flex items-end gap-1">
              <div className="text-2xl font-semibold">{currentStreak}</div>
              days
            </div>
          </div>
        </div>
        <Heatmap data={focusTimeData} />
      </CardBody>
    </Card>
  );
}
