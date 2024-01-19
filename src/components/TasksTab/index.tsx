import { Card, CardBody } from '@nextui-org/card';
import TabWrapper from '../TabWrapper';
import Tasks from './Tasks';
import Toolbar from './Toolbar';

export default function TasksTab() {
  return (
    <TabWrapper>
      <Card className="min-h-[50vh] w-[90vw] bg-[#23223C] sm:h-[30rem] sm:w-[30rem]">
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
