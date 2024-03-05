'use client';

import Summary from '@/components/Stats/Summary';
import useStatsStore from '@/stores/useStatsStore';
import DailyStats from './DailyStats';
import TaskTime from './TaskTime';

export default function Wrapper({ isPro }: { isPro: boolean }) {
  const { date } = useStatsStore((state) => state);
  const isBlocked = !isPro && date.toDateString() !== new Date().toDateString();

  return (
    <div className="flex flex-col gap-5 py-10">
      <div className="flex flex-col items-center justify-between gap-10 px-5 md:flex-row md:gap-0">
        <h1 className="flex items-center gap-3 self-start text-3xl font-semibold">
          Stats
        </h1>
        {!isBlocked ? <Summary /> : null}
      </div>
      <DailyStats isBlocked={isBlocked} />
      {!isBlocked ? <TaskTime /> : null}
    </div>
  );
}
