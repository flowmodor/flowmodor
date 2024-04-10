'use client';

import { Select, SelectItem } from '@nextui-org/select';
import {
  defaultActiveList,
  useActiveLabel,
  useActiveList,
  useIsLoadingLists,
  useLabels,
  useTasksActions,
} from '@/stores/useTasksStore';
import { useMode, useStatus } from '@/stores/useTimerStore';

export default function Filter() {
  const status = useStatus();
  const mode = useMode();
  const labels = useLabels();
  const activeLabel = useActiveLabel();
  const isLoadingLists = useIsLoadingLists();
  const activeList = useActiveList();
  const { onLabelChange } = useTasksActions();

  if (activeList === defaultActiveList) {
    return null;
  }

  return (
    <Select
      size="sm"
      radius="sm"
      selectionMode="single"
      label="Filter by label"
      isLoading={isLoadingLists}
      isDisabled={status === 'running' && mode === 'focus'}
      classNames={{
        trigger: 'bg-secondary data-[hover=true]:bg-secondary',
        popoverContent: 'bg-background',
      }}
      selectedKeys={activeLabel !== '' ? [activeLabel] : []}
      onChange={onLabelChange}
    >
      {labels.map((label) => (
        <SelectItem
          key={label}
          classNames={{
            base: 'data-[focus=true]:!bg-secondary data-[hover=true]:!bg-secondary',
          }}
        >
          {label}
        </SelectItem>
      ))}
    </Select>
  );
}
