import { Card, CardBody } from '@nextui-org/card';
import { Select, SelectItem } from '@nextui-org/select';
import { useTransition } from 'react';
import useTasksStore from '@/stores/useTasksStore';
import TabWrapper from '../TabWrapper';
import Tasks from './Tasks';
import Toolbar from './Toolbar';

export default function TasksTab() {
  const { lists, activeList, isLoadingLists, onListChange, fetchTasks } =
    useTasksStore((state) => state);
  const [isFetching, startTransition] = useTransition();

  return (
    <TabWrapper>
      <Card className="h-[55vh] w-[90vw] bg-[#23223C] sm:h-[30rem] sm:w-[30rem]">
        <CardBody
          className="itesm flex h-full w-full flex-col gap-3
            overflow-y-scroll scrollbar-hide"
        >
          <Select
            size="sm"
            radius="sm"
            selectionMode="single"
            label="Select a list"
            isLoading={isLoadingLists}
            classNames={{
              trigger: 'bg-secondary data-[hover=true]:bg-secondary',
              popoverContent: 'bg-background',
            }}
            selectedKeys={[activeList]}
            onChange={(e) => {
              const isSuccess = onListChange(e);
              if (!isSuccess) {
                return;
              }

              startTransition(async () => {
                await fetchTasks();
              });
            }}
          >
            {lists.map((list) => (
              <SelectItem
                key={`${list.provider} - ${list.id}`}
                classNames={{
                  base: 'data-[focus=true]:!bg-secondary data-[hover=true]:!bg-secondary',
                }}
              >
                {`${list.provider} - ${list.name}`}
              </SelectItem>
            ))}
          </Select>
          <Tasks isLoading={isFetching} />
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
