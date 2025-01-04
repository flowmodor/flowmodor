'use client';

import { Source } from '@flowmodor/task-sources';
import { Select, SelectItem } from '@nextui-org/select';
import {
  useActiveList,
  useActiveSource,
  useIsLoadingLists,
  useLists,
  useTasksActions,
} from '@/hooks/useTasks';
import { useMode, useStatus } from '@/hooks/useTimer';

export default function ListSelector() {
  const status = useStatus();
  const mode = useMode();
  const activeSource = useActiveSource();
  const lists = useLists();
  const activeList = useActiveList();
  const isLoadingLists = useIsLoadingLists();
  const { onListChange, fetchTasks } = useTasksActions();

  if (activeSource === Source.Flowmodor) {
    return null;
  }

  const selectItems = lists.map((list) => (
    <SelectItem
      key={list.id}
      classNames={{
        base: 'data-[focus=true]:!bg-secondary data-[hover=true]:!bg-secondary',
      }}
    >
      {list.name}
    </SelectItem>
  ));

  return (
    <Select
      size="sm"
      radius="sm"
      selectionMode="single"
      label="List"
      isLoading={isLoadingLists}
      isDisabled={status === 'running' && mode === 'focus'}
      classNames={{
        trigger: 'bg-secondary data-[hover=true]:bg-secondary',
        popoverContent: 'bg-background',
      }}
      selectedKeys={activeList ? [activeList] : []}
      onChange={async (e) => {
        if (e.target.value === '') {
          return;
        }

        onListChange(e.target.value);
        await fetchTasks();
      }}
    >
      {selectItems}
    </Select>
  );
}
