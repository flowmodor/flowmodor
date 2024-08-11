import { Card, CardBody } from '@nextui-org/card';
import TabWrapper from '../TabWrapper';
import Progress from './Progress';
import TaskSelector from './TaskSelector';
import Toolbar from './Toolbar';

export default function TimerTab() {
  return (
    <TabWrapper>
      <Card className="h-[55vh] w-[90vw] bg-midground sm:h-[30rem] sm:w-[30rem]">
        <CardBody className="flex h-full flex-col items-center justify-center">
          <TaskSelector />
          <Progress />
        </CardBody>
      </Card>
      <Card className="bg-midground">
        <CardBody>
          <Toolbar />
        </CardBody>
      </Card>
    </TabWrapper>
  );
}
