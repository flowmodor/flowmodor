'use client';

import { Select, SelectItem } from '@nextui-org/select';
import { Source } from '@/stores/sources';
import {
  useActiveLabel,
  useActiveSource,
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
  const activeSource = useActiveSource();
  const { onLabelChange } = useTasksActions();

  if (activeSource !== Source.Todoist) {
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
