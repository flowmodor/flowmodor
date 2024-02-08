'use client';

// import { Button } from '@nextui-org/button';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Link } from '@nextui-org/link';
import { Spinner } from '@nextui-org/spinner';
import { useEffect, useRef, useState } from 'react';
import GoHome from '@/components/GoHome';
import { Left, Right, /* Share */ } from '@/components/Icons';
import DateButton from '@/components/Stats/DateButton';
import LineChart from '@/components/Stats/LineChart';
import Summary from '@/components/Stats/Summary';
import { processLogs } from '@/utils';
import {
  LogsWithTasks,
  calculateTaskTime,
} from '@/utils/stats/calculateTaskTime';
// import downloadImage from '@/utils/stats/downloadImage';
import supabase from '@/utils/supabase';
import TaskTime from './TaskTime';

export default function Wrapper({ isPro }: { isPro: boolean }) {
  const [date, setDate] = useState(new Date());
  const [logs, setLogs] = useState<LogsWithTasks[] | null>(null);
  const chartRef = useRef<any>(null);
  const taskTime = calculateTaskTime(logs ?? []);
  const processedLogs = processLogs(logs ?? []);
  const isBlocked = !isPro && date.toDateString() !== new Date().toDateString();
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from('logs')
        .select('*, tasks(name)')
        .gte('start_time', startDate.toISOString())
        .lte('start_time', endDate.toISOString());

      if (!error) {
        setLogs(data);
      }
    })();
  }, [date]);

  return (
    <div className="flex flex-col gap-5 py-10">
      <div className="flex flex-col items-center justify-between gap-10 px-5 md:flex-row md:gap-0">
        <h1 className="flex items-center gap-3 self-start text-3xl font-semibold">
          <GoHome />
          Stats
        </h1>
        <Summary ref={summaryRef} data={!isBlocked && logs ? logs : []} />
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
          {/* logs ? (
            <Button
              isIconOnly
              color="secondary"
              size="sm"
              className="absolute top-5 right-5 fill-white"
              onPress={() => downloadImage(chartRef, summaryRef, date)}
            >
              <Share />
            </Button>
          ) : null */}
        </CardHeader>
        <CardBody
          className={`flex items-center justify-center lg:min-h-[60vh] lg:min-w-[50vw] ${
            isBlocked ? 'blur-md' : ''
          }`}
        >
          {logs ? (
            <LineChart ref={chartRef} data={processedLogs} />
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
      {taskTime.length > 0 ? <TaskTime datas={taskTime} /> : null}
    </div>
  );
}
