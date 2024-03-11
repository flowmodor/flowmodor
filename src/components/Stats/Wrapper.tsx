'use client';

import Summary from '@/components/Stats/Summary';
import useStatsStore from '@/stores/useStatsStore';
import DailyStats from './DailyStats';
import TaskTime from './TaskTime';

export default function Wrapper({ isPro }: { isPro: boolean }) {
  const { date } = useStatsStore((state) => state);
  const isBlocked = !isPro && date.toDateString() !== new Date().toDateString();

  return (
    <div className="w-full p-5 flex flex-col h-max lg:h-auto lg:justify-center lg:flex-row gap-5">
      <DailyStats isBlocked={isBlocked} />
      {!isBlocked ? (
        <div className="flex flex-col gap-5 xl:min-w-[28rem]">
          <Summary />
          <TaskTime />
        </div>
      ) : null}
    </div>
  );
}
