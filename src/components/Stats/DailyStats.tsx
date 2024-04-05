'use client';

import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card';
import { Chip } from '@nextui-org/chip';
import { Link } from '@nextui-org/link';
import { useRef } from 'react';
import { toast } from 'sonner';
import { Left, Right } from '@/components/Icons';
import BarChart from '@/components/Stats/BarChart';
import DateButton from '@/components/Stats/DateButton';
import { useDate, useLogs, useStatsActions } from '@/stores/useStatsStore';
import calculateFocusTimes from '@/utils/stats/calculateFocusTime';
import downloadImage from '@/utils/stats/downloadImage';
import ShareButton from './ShareButton';

export default function DailyStats({ isPro }: { isPro: boolean }) {
  const logs = useLogs();
  const { goPreviousDay, goNextDay } = useStatsActions();
  const totalFocusTime = logs ? calculateFocusTimes(logs).totalFocusTime : 0;
  const date = useDate();
  const chartRef = useRef<any>(null);

  const handleShare = async (openX: boolean) => {
    const isSuccess = await downloadImage(chartRef, totalFocusTime, date);
    if (!isSuccess) {
      toast.error('Error downloading image. Please try again.');
      return;
    }
    if (openX) {
      window.open(
        'https://twitter.com/intent/tweet?text=Check out my daily stats on @flowmodor!%0a%28attach the image that was just downloaded%29',
      );
    }
  };

  return (
    <Card radius="sm" className="bg-[#23223C] p-5">
      <CardHeader className="flex flex-col gap-1">
        <div className="flex items-center gap-5 font-semibold">
          <DateButton onPress={goPreviousDay} isDisabled={!isPro}>
            <Left />
          </DateButton>
          {date.toDateString()}
          <DateButton
            onPress={goNextDay}
            isDisabled={new Date().getDate() === date.getDate()}
          >
            <Right />
          </DateButton>
        </div>
        {logs ? <ShareButton handleShare={handleShare} /> : null}
      </CardHeader>
      <CardBody className="flex items-center justify-center lg:min-h-[60vh] lg:min-w-[50vw]">
        <BarChart ref={chartRef} logs={logs ?? []} />
      </CardBody>
      {!isPro ? (
        <CardFooter>
          <div className="text-sm mx-auto">
            Upgrade to{' '}
            <Chip as={Link} size="sm" radius="sm" color="primary" href="/plans">
              Pro
            </Chip>{' '}
            to see more stats
          </div>
        </CardFooter>
      ) : null}
    </Card>
  );
}
