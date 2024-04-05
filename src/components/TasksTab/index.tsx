import { Card, CardBody } from '@nextui-org/card';
import TabWrapper from '../TabWrapper';
import Filter from '../TimerTab/Filter';
import ListSelector from '../TimerTab/ListSelector';
import Tasks from './Tasks';
import Toolbar from './Toolbar';

export default function TasksTab() {
  return (
    <TabWrapper>
      <Card className="h-[55vh] w-[90vw] bg-[#23223C] sm:h-[30rem] sm:w-[30rem]">
        <CardBody className="flex h-full flex-col gap-3">
          <div className="flex gap-3">
            <ListSelector />
            <Filter />
          </div>
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
