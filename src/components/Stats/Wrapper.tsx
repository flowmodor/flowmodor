'use client';

import { useEffect, useState } from 'react';
import { Spinner } from '@nextui-org/spinner';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Link } from '@nextui-org/link';

import { Left, Right } from '@/components/Icons';
import LineChart from '@/components/Stats/LineChart';
import DateButton from '@/components/Stats/DateButton';
import Summary from '@/components/Stats/Summary';
import GoHome from '@/components/GoHome';
import { processLogs } from '@/utils';
import supabase from '@/utils/supabase';

export default function Wrapper({ isPro }: { isPro: boolean }) {
  const [date, setDate] = useState(new Date());
  const [logs, setLogs] = useState<any[]>([]);
  const processedLogs = processLogs(logs);
  const isBlocked = !isPro && date.toDateString() !== new Date().toDateString();

  useEffect(() => {
    (async () => {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from('logs')
        .select('*')
        .gte('start_time', startDate.toISOString())
        .lte('start_time', endDate.toISOString());

      if (!error) {
        setLogs(data);
      }
    })();
  }, [date]);
  return (
    <>
      <div className="flex flex-col items-center justify-between px-5 md:flex-row">
        <h1 className="flex items-center gap-3 text-3xl font-semibold">
          <GoHome />
          Stats
        </h1>
        <Summary data={isBlocked ? [] : logs} />
      </div>
      <Card className="rounded-lg bg-[#23223C] p-5">
        <CardHeader className="justify-center gap-5 font-semibold">
          <DateButton
            onPress={() => {
              const yesterday = new Date(date);
              yesterday.setDate(date.getDate() - 1);
              setDate(yesterday);
            }}
          >
            <Left />
          </DateButton>
          {date.toDateString()}
          <DateButton
            onPress={() => {
              const tomorrow = new Date(date);
              tomorrow.setDate(date.getDate() + 1);
              setDate(tomorrow);
            }}
          >
            <Right />
          </DateButton>
        </CardHeader>
        <CardBody
          className={`flex items-center justify-center lg:min-h-[60vh] lg:min-w-[50vw] ${
            isBlocked ? 'blur-md' : ''
          }`}
        >
          {processedLogs ? (
            <LineChart data={processedLogs} />
          ) : (
            <Spinner color="primary" />
          )}
        </CardBody>
        {isBlocked ? (
          <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transform text-white">
            <Link underline="always" href="/plans">
              Upgrade to Pro
            </Link>{' '}
            to see more stats
          </div>
        ) : null}
      </Card>
    </>
  );
}
