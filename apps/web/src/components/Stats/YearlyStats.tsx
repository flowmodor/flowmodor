'use client';

import { Tables } from '@flowmodor/types';
import { Card, CardBody } from '@nextui-org/card';
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

  return (
    <Card radius="sm" className="shrink-0 flex flex-col bg-midground w-full">
      <CardBody>
        <Heatmap data={focusTimeData} />
      </CardBody>
    </Card>
  );
}
