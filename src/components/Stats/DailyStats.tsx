import { Button } from '@nextui-org/button';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Link } from '@nextui-org/link';
import { Spinner } from '@nextui-org/spinner';
import { Dispatch, SetStateAction, useRef } from 'react';
import { Left, Right, Share } from '@/components/Icons';
import DateButton from '@/components/Stats/DateButton';
import LineChart from '@/components/Stats/LineChart';
import { processLogs } from '@/utils';
import calculateFocusTimes from '@/utils/stats/calculateFocusTime';
import { LogsWithTasks } from '@/utils/stats/calculateTaskTime';
import downloadImage from '@/utils/stats/downloadImage';

export default function DailyStats({
  logs,
  date,
  isBlocked,
  setDate,
}: {
  logs: LogsWithTasks[];
  date: Date;
  isBlocked: boolean;
  setDate: Dispatch<SetStateAction<Date>>;
}) {
  const chartRef = useRef<any>(null);
  const processedLogs = processLogs(logs);
  const { totalFocusTime } = calculateFocusTimes(logs);

  return (
    <Card className="rounded-lg bg-[#23223C] p-5">
      <CardHeader className="justify-center gap-5 font-semibold">
        <DateButton
          onPress={() => {
            const yesterday = new Date(date);
            yesterday.setDate(date.getDate() - 1);
            setDate(yesterday);
          }}
        >
          <Left />
        </DateButton>
        {date.toDateString()}
        <DateButton
          onPress={() => {
            const tomorrow = new Date(date);
            tomorrow.setDate(date.getDate() + 1);
            setDate(tomorrow);
          }}
        >
          <Right />
        </DateButton>
        {logs && !isBlocked ? (
          <Button
            isIconOnly
            color="secondary"
            size="sm"
            className="absolute top-5 right-5 fill-white"
            onPress={() => downloadImage(chartRef, totalFocusTime, date)}
          >
            <Share />
          </Button>
        ) : null}
      </CardHeader>
      <CardBody
        className={`flex items-center justify-center lg:min-h-[60vh] lg:min-w-[50vw] ${
          isBlocked ? 'blur-md' : ''
        }`}
      >
        {logs ? (
          <LineChart ref={chartRef} data={processedLogs} />
        ) : (
          <Spinner color="primary" />
        )}
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
