'use client';

import { Select, SelectItem } from '@nextui-org/select';
import Link from 'next/link';
import {
  useActiveList,
  useIsLoadingLists,
  useLists,
  useTasksActions,
} from '@/stores/useTasksStore';
import { useMode, useStatus } from '@/stores/useTimerStore';

export default function ListSelector() {
  const status = useStatus();
  const mode = useMode();
  const lists = useLists();
  const activeList = useActiveList();
  const isLoadingLists = useIsLoadingLists();
  const { onListChange, fetchTasks } = useTasksActions();

  const selectItems = lists.map((list) => (
    <SelectItem
      key={`${list.provider} - ${list.id}`}
      classNames={{
        base: 'data-[focus=true]:!bg-secondary data-[hover=true]:!bg-secondary',
      }}
    >
      {`${list.provider} - ${list.name}`}
    </SelectItem>
  ));

  if (lists.length === 1 && !isLoadingLists) {
    selectItems.push(
      <SelectItem
        as={Link}
        key="hint"
        href="/settings"
        classNames={{
          base: 'mt-1 border-2 border-secondary border-dashed data-[focus=true]:!bg-background data-[hover=true]:!bg-background',
          title: 'items-center flex gap-2 ',
        }}
      >
        Connect Todoist to access multiple lists
      </SelectItem>,
    );
  }

  return (
    <Select
      size="sm"
      radius="sm"
      selectionMode="single"
      label="Select a list"
      isLoading={isLoadingLists}
      isDisabled={status === 'running' && mode === 'focus'}
      classNames={{
        trigger: 'bg-secondary data-[hover=true]:bg-secondary',
        popoverContent: 'bg-background',
      }}
      selectedKeys={[activeList]}
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
