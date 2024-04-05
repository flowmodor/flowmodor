'use client';

import { Link } from '@nextui-org/link';
import { Select, SelectItem } from '@nextui-org/select';
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

  return (
    <Select
      size="sm"
      radius="sm"
      selectionMode="single"
      label="Select a list"
      isLoading={isLoadingLists}
      isDisabled={status === 'running' && mode === 'focus'}
      description={
        lists.length === 1 ? (
          <span>
            Connect Todoist in{' '}
            <Link
              href="/settings"
              underline="always"
              className="text-inherit text-xs underline-offset-2"
            >
              settings
            </Link>{' '}
            to access multiple lists
          </span>
        ) : null
      }
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
  );
}
