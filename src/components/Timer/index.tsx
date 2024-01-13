import { Card, CardBody } from '@nextui-org/card';
import TaskSelector from './TaskSelector';
import Progress from './Progress';
import Toolbar from './Toolbar';

export default function Timer() {
  return (
    <div className="flex flex-col gap-5">
      <Card className="h-[30rem] w-[30rem] bg-[#23223C]">
        <CardBody className="flex h-full flex-col items-center justify-center">
          <TaskSelector />
          <Progress />
        </CardBody>
      </Card>
      <Card className="bg-[#23223C]">
        <CardBody>
          <Toolbar />
        </CardBody>
      </Card>
    </div>
  );
}
