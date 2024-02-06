import { Card, CardBody } from '@nextui-org/card';
import TimeFormatter from './TimeFormatter';

export default function TaskTime({ datas }: { datas: any[] }) {
  return (
    <Card className="mt-5 rounded-lg bg-[#23223C] p-5">
      {datas.map((data) => (
        <CardBody key={data.name}>
          <p>{data.name}</p>
          <TimeFormatter minutes={Math.round(data.time)} />
        </CardBody>
      ))}
    </Card>
  );
}
