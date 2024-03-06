import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Link } from '@nextui-org/link';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import { Left, Right } from '@/components/Icons';
import DateButton from '@/components/Stats/DateButton';
import LineChart from '@/components/Stats/LineChart';
import useStatsStore from '@/stores/useStatsStore';
import { logsToChartData } from '@/utils';
import calculateFocusTimes from '@/utils/stats/calculateFocusTime';
import downloadImage from '@/utils/stats/downloadImage';
import ShareButton from './ShareButton';

export default function DailyStats({ isBlocked }: { isBlocked: boolean }) {
  const { date, logs, goPreviousDay, goNextDay } = useStatsStore(
    (state) => state,
  );
  const totalFocusTime = logs ? calculateFocusTimes(logs).totalFocusTime : 0;
  const chartData = logs ? logsToChartData(logs) : undefined;
  const chartRef = useRef<any>(null);

  const handleShare = async (openX: boolean) => {
    const isSuccess = await downloadImage(chartRef, totalFocusTime, date);
    if (!isSuccess) {
      toast('Error downloading image. Please try again.');
      return;
    }
    if (openX) {
      window.open(
        'https://twitter.com/intent/tweet?text=Check out my daily stats on @flowmodor!%0a%28attach the image that was just downloaded%29',
      );
    }
  };

  return (
    <Card className="rounded-lg bg-[#23223C] p-5">
      <CardHeader className="justify-center gap-5 font-semibold">
        <DateButton onPress={goPreviousDay}>
          <Left />
        </DateButton>
        {date.toDateString()}
        <DateButton onPress={goNextDay}>
          <Right />
        </DateButton>
        {logs && !isBlocked ? <ShareButton handleShare={handleShare} /> : null}
      </CardHeader>
      <CardBody
        className={`flex items-center justify-center lg:min-h-[60vh] lg:min-w-[50vw] ${
          isBlocked ? 'blur-md' : ''
        }`}
      >
        <LineChart ref={chartRef} data={chartData} />
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
  );
}
