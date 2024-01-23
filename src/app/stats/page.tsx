'use client';

import { useEffect, useState } from 'react';
import { Spinner } from '@nextui-org/spinner';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Left, Right } from '@/components/Icons';
import { processLogs } from '@/utils';
import supabase from '@/utils/supabase';
import LineChart from '@/components/Stats/LineChart';
import DateButton from '@/components/Stats/DateButton';
import Summary from '@/components/Stats/Summary';
import Menu from '@/components/Menu';

export default function Stats() {
  const [date, setDate] = useState(new Date());
  const [logs, setLogs] = useState<any[]>([]);
  const processedLogs = processLogs(logs);

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
      <Menu />
      <div className="flex h-full flex-col justify-center gap-3">
        <div className="flex flex-col items-center justify-between px-5 md:flex-row">
          <h1 className="text-3xl font-semibold">Stats</h1>
          <Summary data={logs} />
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
          <CardBody className="flex items-center justify-center lg:h-[60vh] lg:w-[50vw]">
            {logs ? (
              <LineChart data={processedLogs} />
            ) : (
              <Spinner color="primary" />
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
}
