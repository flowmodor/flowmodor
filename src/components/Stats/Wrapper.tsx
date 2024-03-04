'use client';

import { useEffect, useState } from 'react';
import { fetchLogs } from '@/actions/stats';
import Summary from '@/components/Stats/Summary';
import {
  LogsWithTasks,
  calculateTaskTime,
} from '@/utils/stats/calculateTaskTime';
import DailyStats from './DailyStats';
import TaskTime from './TaskTime';

export default function Wrapper({ isPro }: { isPro: boolean }) {
  const [date, setDate] = useState(new Date());
  const [logs, setLogs] = useState<LogsWithTasks[] | null>(null);
  const taskTime = calculateTaskTime(logs ?? []);
  const isBlocked = !isPro && date.toDateString() !== new Date().toDateString();

  useEffect(() => {
    (async () => {
      const { data, error } = await fetchLogs(date);
      if (!error) {
        setLogs(data);
      }
    })();
  }, [date]);

  return (
    <div className="flex flex-col gap-5 py-10">
      <div className="flex flex-col items-center justify-between gap-10 px-5 md:flex-row md:gap-0">
        <h1 className="flex items-center gap-3 self-start text-3xl font-semibold">
          Stats
        </h1>
        <Summary data={!isBlocked && logs ? logs : []} />
      </div>
      <DailyStats
        logs={logs ?? []}
        date={date}
        isBlocked={isBlocked}
        setDate={setDate}
      />
      {taskTime.length > 0 && !isBlocked ? <TaskTime datas={taskTime} /> : null}
    </div>
  );
}
