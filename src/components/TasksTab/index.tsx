import { Card, CardBody } from '@nextui-org/card';
import TabWrapper from '../TabWrapper';
import Tasks from './Tasks';
import Toolbar from './Toolbar';

export default function TasksTab() {
  return (
    <TabWrapper>
      <Card className="h-[30rem] w-[30rem] bg-[#23223C]">
        <CardBody
          className="itesm flex h-full w-full flex-col gap-3
            overflow-y-scroll scrollbar-hide"
        >
          <Tasks />
        </CardBody>
      </Card>
      <Card className="bg-[#23223C]">
        <CardBody className="flex flex-row items-center justify-between px-4">
          <Toolbar />
        </CardBody>
      </Card>
    </TabWrapper>
  );
}
