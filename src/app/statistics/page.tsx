'use client';

import { useEffect, useState } from 'react';
import { Spinner } from '@nextui-org/spinner';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import LineChart from '@/components/Statistics/LineChart';
import { Left, Right } from '@/components/Icons';
import { processLogs } from '@/utils';
import supabase from '@/utils/supabase';
import DateButton from '@/components/Statistics/DateButton';

export default function StatisticsPage() {
  const [data, setData] = useState<Map<number, any>>();
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    (async () => {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      const { data: logs, error } = await supabase
        .from('logs')
        .select('*')
        .gte('start_time', startDate.toISOString())
        .lte('start_time', endDate.toISOString());

      if (!error) {
        setData(processLogs(logs));
      }
    })();
  }, [date]);

  return (
    <div className="flex h-full flex-col justify-center gap-5">
      <h1 className="text-3xl font-semibold">Statistics</h1>
      <Card className="w-full rounded-lg bg-[#23223C] p-5 lg:h-[60vh] lg:w-[50vw]">
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
        <CardBody className="flex items-center justify-center">
          {data ? <LineChart data={data} /> : <Spinner color="primary" />}
        </CardBody>
      </Card>
    </div>
  );
}
