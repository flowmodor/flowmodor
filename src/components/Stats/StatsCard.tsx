'use client';

import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { useEffect, useRef } from 'react';
import { Left, Right } from '@/components/Icons';
import DailyBarChart from '@/components/Stats/DailyBarChart';
import DateButton from '@/components/Stats/DateButton';
import {
  useDisplayTime,
  useIsDisabled,
  useLogs,
  usePeriod,
  useStatsActions,
} from '@/stores/useStatsStore';
import PeriodSelector from './PeriodSelector';
import WeeklyBarChart from './WeeklyBarChart';

export default function StatsCard() {
  const logs = useLogs();
  const { goPreviousTime, goNextTime, updateLogs } = useStatsActions();
  const displayTime = useDisplayTime();
  const chartRef = useRef<any>(null);
  const effectRunRef = useRef(false);
  const period = usePeriod();
  const isDisabled = useIsDisabled();

  useEffect(() => {
    if (effectRunRef.current) {
      return;
    }
    effectRunRef.current = true;
    updateLogs();
  }, [updateLogs]);

  return (
    <Card radius="sm" className="h-full bg-midground p-5 pb-0">
      <CardHeader className="flex flex-col gap-1">
        <div className="flex justify-center w-full items-center gap-5 font-semibold">
          <PeriodSelector />
          <DateButton onPress={goPreviousTime} ariaLabel="Previous day">
            <Left />
          </DateButton>
          {displayTime}
          <DateButton
            onPress={goNextTime}
            ariaLabel="Next day"
            isDisabled={isDisabled}
          >
            <Right />
          </DateButton>
        </div>
      </CardHeader>
      <CardBody className="flex items-center justify-center lg:min-h-[60vh] lg:min-w-[50vw]">
        {period === 'Day' ? (
          <DailyBarChart ref={chartRef} logs={logs ?? []} />
        ) : null}
        {period === 'Week' ? (
          <WeeklyBarChart ref={chartRef} logs={logs ?? []} />
        ) : null}
      </CardBody>
    </Card>
  );
}
