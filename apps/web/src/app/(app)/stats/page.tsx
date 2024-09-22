import { Metadata } from 'next';
import { cookies } from 'next/headers';
import StatsCard from '@/components/Stats/StatsCard';
import Summary from '@/components/Stats/Summary';
import TaskTime from '@/components/Stats/TaskTime';
import YearlyStats from '@/components/Stats/YearlyStats';
import { getServerClient } from '@/utils/supabase';

export const metadata: Metadata = {
  title: 'Stats | Flowmodor',
};

export default async function Stats() {
  const supabase = getServerClient(cookies());
  const { data } = await supabase.from('logs').select('*');

  return (
    <div className="w-full lg:justify-center lg:items-center p-5 flex flex-col sm:min-h-screen overflow-y-auto gap-5">
      <div className="w-full flex flex-col lg:justify-center lg:flex-row gap-5 lg:h-[70vh]">
        <div className="lg:w-2/3">
          <StatsCard />
        </div>
        <div className="flex flex-col gap-5 lg:w-1/3">
          <Summary />
          <TaskTime />
        </div>
      </div>
      <YearlyStats data={data ?? []} />
    </div>
  );
}
