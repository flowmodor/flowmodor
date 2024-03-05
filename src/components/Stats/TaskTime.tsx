import { Card, CardBody } from '@nextui-org/card';
import useStatsStore from '@/stores/useStatsStore';
import { calculateTaskTime } from '@/utils/stats/calculateTaskTime';
import TimeFormatter from './TimeFormatter';

export default function TaskTime() {
  const { logs } = useStatsStore((state) => state);
  const taskTime = calculateTaskTime(logs ?? []);

  if (taskTime.length === 0) return null;

  return (
    <Card className="mt-5 rounded-lg bg-[#23223C] p-5">
      {taskTime.map((data) => (
        <CardBody key={data.name}>
          <p>{data.name}</p>
          <TimeFormatter minutes={Math.round(data.time)} />
        </CardBody>
      ))}
    </Card>
  );
}
