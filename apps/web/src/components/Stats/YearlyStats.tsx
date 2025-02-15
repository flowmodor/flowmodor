'use client';

import { Tables } from '@flowmodor/types';
import { Card, CardBody } from '@heroui/card';
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
    <Card className="flex w-full shrink-0 flex-col bg-midground">
      <CardBody className="flex flex-col gap-4 lg:flex-row lg:gap-8">
        <div className="mx-10 flex shrink-0 flex-row justify-center gap-10 lg:flex-col lg:gap-6">
          <div className="flex flex-col items-center">
            <div className="text-sm">Longest Streak</div>
            <div className="flex items-end gap-1">
              <div className="text-3xl font-semibold">{longestStreak}</div>
              days
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-sm">Current Streak</div>
            <div className="flex items-end gap-1">
              <div className="text-3xl font-semibold">{currentStreak}</div>
              days
            </div>
          </div>
        </div>
        <Heatmap data={focusTimeData} />
      </CardBody>
    </Card>
  );
}
