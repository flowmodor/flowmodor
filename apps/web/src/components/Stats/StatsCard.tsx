'use client';

import { Button } from '@nextui-org/button';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Tooltip } from '@nextui-org/tooltip';
import Link from 'next/link';
import { useEffect, useRef, useTransition } from 'react';
import { toast } from 'sonner';
import { Left, Right, Share } from '@/components/Icons';
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
import { calculateFocusTime } from '@/utils/stats/calculateFocusTime';
import copyImageToClipboard from '@/utils/stats/copyImageToClipboard';
import PeriodSelector from './PeriodSelector';
import WeeklyBarChart from './WeeklyBarChart';

export default function StatsCard() {
  const logs = useLogs();
  const startDate = useStartDate();
  const endDate = useEndDate();
  const { totalFocusTime } = calculateFocusTime(logs ?? []);
  const { goPreviousTime, goNextTime, updateLogs, setDate } = useStatsActions();
  const displayTime = useDisplayTime();
  const chartRef = useRef(null);
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
    <Card className="h-full bg-midground p-2 pb-0">
      <CardHeader className="flex flex-col gap-1">
        <div className="flex w-full items-center justify-center gap-5 font-semibold">
          <PeriodSelector />
          <div className="mx-auto flex items-center gap-5">
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
            onPress={() => {
              setDate(new Date());
            }}
          >
            Today
          </Button>
          <Tooltip
            isOpen={
              period === 'Week'
                ? totalFocusTime > 15 * 60
                : totalFocusTime > 3 * 60
            }
            showArrow
            color="primary"
            content="Share your stats!"
          >
            <Button
              radius="sm"
              color="secondary"
              className="hidden sm:flex"
              onPress={() => {
                startTransition(async () => {
                  const success = await copyImageToClipboard(
                    chartRef,
                    totalFocusTime,
                    dateText,
                  );
                  if (success) {
                    toast.success(
                      <div>
                        Your stats image is copied to clipboard. Share it to{' '}
                        <Link
                          target="_blank"
                          href="https://x.com/intent/tweet?text=Stay in flow with @flowmodor%0A(Ctrl%2BV/⌘%2BV to paste your stats image)"
                          className="text-[#DBBFFF]"
                        >
                          X
                        </Link>
                        ,{' '}
                        <Link
                          target="_blank"
                          href="https://www.linkedin.com/sharing/share-offsite/"
                          className="text-[#DBBFFF]"
                        >
                          LinkedIn
                        </Link>
                        ,{' '}
                        <Link
                          target="_blank"
                          href="https://reddit.com/submit?title=(Ctrl%2BV/⌘%2BV to paste your stats image)&type=image"
                          className="text-[#DBBFFF]"
                        >
                          Reddit
                        </Link>{' '}
                        or anywhere you want!
                      </div>,
                    );
                  }
                });
              }}
              isLoading={isLoading}
              isIconOnly
            >
              <Share />
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
