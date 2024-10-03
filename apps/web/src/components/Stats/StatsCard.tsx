'use client';

import { Button } from '@nextui-org/button';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Tooltip } from '@nextui-org/tooltip';
import { useEffect, useRef, useTransition } from 'react';
import { Download, Left, Right } from '@/components/Icons';
import DailyBarChart from '@/components/Stats/DailyBarChart';
import DateButton from '@/components/Stats/DateButton';
import {
  useDisplayTime,
  useEndDate,
  useIsDisabled,
  useLogs,
  usePeriod,
  useStartDate,
  useStatsActions,
} from '@/stores/useStatsStore';
import calculateFocusTimes from '@/utils/stats/calculateFocusTime';
import downloadImage from '@/utils/stats/downloadImage';
import PeriodSelector from './PeriodSelector';
import WeeklyBarChart from './WeeklyBarChart';

export default function StatsCard() {
  const logs = useLogs();
  const startDate = useStartDate();
  const endDate = useEndDate();
  const { totalFocusTime } = calculateFocusTimes(logs ?? []);
  const { goPreviousTime, goNextTime, updateLogs, setDate } = useStatsActions();
  const displayTime = useDisplayTime();
  const chartRef = useRef<any>(null);
  const effectRunRef = useRef(false);
  const period = usePeriod();
  const isDisabled = useIsDisabled();
  const [isLoading, startTransition] = useTransition();

  const dateText =
    startDate.getTime() === endDate.getTime()
      ? startDate.toDateString()
      : `${startDate.toDateString()} - ${endDate.toDateString()}`;

  useEffect(() => {
    if (effectRunRef.current) {
      return;
    }
    effectRunRef.current = true;
    updateLogs();
  }, [updateLogs]);

  return (
    <Card radius="sm" className="h-full bg-midground p-2 pb-0">
      <CardHeader className="flex flex-col gap-1">
        <div className="flex justify-center w-full items-center gap-5 font-semibold">
          <PeriodSelector />
          <div className="mx-auto flex gap-5 items-center">
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
          <Button
            radius="sm"
            color="secondary"
            className="hidden sm:block"
            onClick={() => {
              setDate(new Date());
            }}
          >
            Today
          </Button>
          <Tooltip showArrow color="primary" content="Share your stats!">
            <Button
              radius="sm"
              color="secondary"
              className="hidden sm:flex"
              onClick={() => {
                startTransition(async () => {
                  await downloadImage(chartRef, totalFocusTime, dateText);
                });
              }}
              isLoading={isLoading}
              isIconOnly
            >
              <Download />
            </Button>
          </Tooltip>
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
