'use client';

import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card';
import { Chip } from '@nextui-org/chip';
import { Link } from '@nextui-org/link';
import { useRef } from 'react';
import { Left, Right } from '@/components/Icons';
import BarChart from '@/components/Stats/BarChart';
import DateButton from '@/components/Stats/DateButton';
import {
  useDisplayTime,
  useEndDate,
  useLogs,
  useStatsActions,
} from '@/stores/useStatsStore';

export default function DailyStats({ isPro }: { isPro: boolean }) {
  const logs = useLogs();
  const { goPreviousTime, goNextTime } = useStatsActions();
  const endDate = useEndDate();
  const displayTime = useDisplayTime();
  const chartRef = useRef<any>(null);

  return (
    <Card radius="sm" className="bg-midground p-5">
      <CardHeader className="flex flex-col gap-1">
        <div className="flex items-center gap-5 font-semibold">
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
            isDisabled={new Date().getDate() === endDate.getDate()}
          >
            <Right />
          </DateButton>
        </div>
      </CardHeader>
      <CardBody className="flex items-center justify-center lg:min-h-[60vh] lg:min-w-[50vw]">
        <BarChart ref={chartRef} logs={logs ?? []} />
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
