import { Metadata } from 'next';
import { cookies } from 'next/headers';
import MonthlyStats from '@/components/Stats/MonthlyStats';
import StatsCard from '@/components/Stats/StatsCard';
import Summary from '@/components/Stats/Summary';
import TaskTime from '@/components/Stats/TaskTime';
import { getServerClient } from '@/utils/supabase';

export const metadata: Metadata = {
  title: 'Stats | Flowmodor',
};

export default async function Stats() {
  const supabase = getServerClient(cookies());
  const { data } = await supabase.from('logs').select('*');

  return (
    <div className="w-full lg:w-auto lg:justify-center lg:items-center p-5 flex flex-col min-h-screen overflow-y-auto gap-5">
      <div className="w-full flex flex-col lg:justify-center lg:flex-row gap-5">
        <StatsCard />
        <div className="flex flex-col gap-5 xl:min-w-[28rem]">
          <Summary />
          <TaskTime />
        </div>
      </div>
      <MonthlyStats data={data ?? []} />
    </div>
  );
}
