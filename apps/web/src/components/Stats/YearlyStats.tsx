'use client';

import { Card, CardBody } from '@nextui-org/card';
import { Tables } from '@/types/supabase';
import Heatmap from './Heatmap';

const calculateFocusTime = (data: Tables<'logs'>[]) => {
  const focusTimeMap: { [key: string]: number } = {};

  data.forEach((item) => {
    const date = new Date(item.start_time).toISOString().split('T')[0];
    const startTime = new Date(item.start_time).getTime();
    const endTime = new Date(item.end_time).getTime();
    const focusTimeInHours = (endTime - startTime) / (1000 * 60 * 60);

    if (focusTimeMap[date]) {
      focusTimeMap[date] += focusTimeInHours;
    } else {
      focusTimeMap[date] = focusTimeInHours;
    }
  });

  return Object.keys(focusTimeMap).map((date) => ({
    date,
    value: focusTimeMap[date],
  }));
};

export default function YearlyStats({ data }: { data: any[] }) {
  return (
    <Card radius="sm" className="shrink-0 flex flex-col bg-midground w-full">
      <CardBody>
        <Heatmap data={calculateFocusTime(data)} />
      </CardBody>
    </Card>
  );
}
