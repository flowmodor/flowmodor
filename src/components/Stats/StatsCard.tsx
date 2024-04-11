'use client';

import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card';
import { Chip } from '@nextui-org/chip';
import { Link } from '@nextui-org/link';
import { Select, SelectItem } from '@nextui-org/select';
import { useRef } from 'react';
import { Left, Right } from '@/components/Icons';
import DailyBarChart from '@/components/Stats/DailyBarChart';
import DateButton from '@/components/Stats/DateButton';
import {
  Period,
  useDisplayTime,
  useIsDisabled,
  useLogs,
  usePeriod,
  useStatsActions,
} from '@/stores/useStatsStore';
import WeeklyBarChart from './WeeklyBarChart';

export default function StatsCard({ isPro }: { isPro: boolean }) {
  const periods: Period[] = ['day', 'week', 'month'];
  const logs = useLogs();
  const { goPreviousTime, goNextTime, onPeriodChange } = useStatsActions();
  const displayTime = useDisplayTime();
  const chartRef = useRef<any>(null);
  const period = usePeriod();
  const isDisabled = useIsDisabled();

  return (
    <Card radius="sm" className="bg-midground p-5">
      <CardHeader className="flex flex-col gap-1">
        <div className="flex justify-center w-full items-center gap-5 font-semibold">
          <Select
            size="sm"
            radius="sm"
            selectionMode="single"
            label="Select a period"
            classNames={{
              trigger: 'bg-secondary data-[hover=true]:bg-secondary',
              popoverContent: 'bg-background',
              base: 'absolute left-5 top-5 max-w-[10rem]',
            }}
            selectedKeys={[period]}
            onChange={(e) => {
              const newPeriod = e.target.value;
              if (newPeriod !== '') {
                onPeriodChange(newPeriod as Period);
              }
            }}
          >
            {periods.map((p) => (
              <SelectItem
                key={p}
                classNames={{
                  base: 'data-[focus=true]:!bg-secondary data-[hover=true]:!bg-secondary',
                }}
              >
                {p}
              </SelectItem>
            ))}
          </Select>
          <DateButton
            onPress={goPreviousTime}
            ariaLabel="Previous day"
            isDisabled={!isPro}
          >
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
        {period === 'day' ? (
          <DailyBarChart ref={chartRef} logs={logs ?? []} />
        ) : null}
        {
          period === 'week' ? (
          <WeeklyBarChart ref={chartRef} logs={logs ?? []} />
        ) : null}
      </CardBody>
      {!isPro ? (
        <CardFooter>
          <div className="text-sm mx-auto">
            Upgrade to{' '}
            <Chip as={Link} size="sm" radius="sm" color="primary" href="/plans">
              Pro
            </Chip>{' '}
            to see more stats
          </div>
        </CardFooter>
      ) : null}
    </Card>
  );
}
