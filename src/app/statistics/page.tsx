import LineChart from '@/components/LineChart';
import { processLogs } from '@/utils';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export default async function StatisticsPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    },
  );

  const date = new Date('2024-01-21');

  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from('logs')
    .select('*')
    .gte('start_time', startDate.toISOString())
    .lte('start_time', endDate.toISOString());

  if (error) {
    return <div>Error</div>;
  }

  return (
    <div className="flex h-full flex-col items-center  justify-center gap-5">
      <h1 className="text-3xl font-semibold">Statistics</h1>
      <LineChart data={processLogs(data)} />
    </div>
  );
}
