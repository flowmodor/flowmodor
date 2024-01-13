import { Card, CardBody } from '@nextui-org/card';
import TaskSelector from './TaskSelector';
import Progress from './Progress';
import Toolbar from './Toolbar';
import TabWrapper from '../TabWrapper';

export default function TimerTab() {
  return (
    <TabWrapper>
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
    </TabWrapper>
  );
}
