'use client';

import LineChart from '@/components/LineChart';
import { processLogs } from '@/utils';
import supabase from '@/utils/supabase';
import { useEffect, useState } from 'react';

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
      <LineChart date={date} setDate={setDate} data={data} />
    </div>
  );
}
