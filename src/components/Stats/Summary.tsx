import calculateFocusTimes from '@/utils/stats/calculateFocusTime';
import TimeFormatter from './TimeFormatter';

function Summary({ data }: { data: any[] }) {
  const { totalFocusTime, longestFocusTime } = calculateFocusTimes(data);

  return (
    <div className="flex gap-10">
      <div className="flex flex-col items-center text-sm">
        Total Focus
        <TimeFormatter minutes={Math.round(totalFocusTime)} />
      </div>
      <div className="flex flex-col items-center text-sm">
        Longest Focus
        <TimeFormatter minutes={Math.round(longestFocusTime)} />
      </div>
    </div>
  );
}

export default Summary;
