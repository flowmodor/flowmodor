import { Metadata } from 'next';
import StatsCard from '@/components/Stats/StatsCard';
import Summary from '@/components/Stats/Summary';
import TaskTime from '@/components/Stats/TaskTime';

export const metadata: Metadata = {
  title: 'Stats | Flowmodor',
};

export default async function Stats() {
  return (
    <div className="w-full px-5 py-5 flex flex-col h-screen lg:py-10 lg:justify-center lg:flex-row gap-5">
      <StatsCard />
      <div className="flex flex-col gap-5 xl:min-w-[28rem]">
        <Summary />
        <TaskTime />
      </div>
    </div>
  );
}
