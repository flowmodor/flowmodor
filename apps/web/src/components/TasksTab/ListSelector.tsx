'use client';

import { Select, SelectItem } from '@nextui-org/select';
import { Source } from '@/stores/sources';
import {
  useActiveList,
  useActiveSource,
  useIsLoadingLists,
  useLists,
  useTasksActions,
} from '@/stores/useTasksStore';
import { useMode, useStatus } from '@/stores/useTimerStore';

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
        const isSuccess = onListChange(e);
        if (!isSuccess) {
          return;
        }
        await fetchTasks();
      }}
    >
      {selectItems}
    </Select>
  );
}
