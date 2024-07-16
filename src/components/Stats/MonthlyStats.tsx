'use client';

import { Card, CardBody } from '@nextui-org/card';
import HeatMap from '@uiw/react-heat-map';
import { Tables } from '@/types/supabase';

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
    count: focusTimeMap[date],
  }));
};

const generatePanelColors = (maxValue: number) => {
  const step = maxValue / 4;
  return {
    0: '#131221',
    [Math.round(step)]: '#3b3852',
    [Math.round(2 * step)]: '#6a6288',
    [Math.round(3 * step)]: '#9f8ec2',
    [Math.round(maxValue)]: '#DBBFFF',
  };
};

export default function MonthlyStats({ data }: { data: any[] }) {
  const value = calculateFocusTime(data);
  const maxValue = Math.max(...value.map((item) => item.count));
  const panelColors = generatePanelColors(maxValue);

  return (
    <Card radius="sm" className="shrink-0 flex flex-col bg-midground w-full">
      <CardBody>
        <HeatMap
          value={value}
          weekLabels={['', 'Mon', '', 'Wed', '', 'Fri', '']}
          startDate={new Date('2024/01/01')}
          rectProps={{ rx: 3, ry: 3 }}
          rectSize={15}
          space={3}
          legendCellSize={0}
          style={{ color: '#ffffffa0', fontSize: 13, fontFamily: 'sans-serif' }}
          panelColors={panelColors}
        />
      </CardBody>
    </Card>
  );
}
