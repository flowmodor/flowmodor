'use client';

import { Select, SelectItem } from '@heroui/select';
import {
  useActiveLabel,
  useIsLoadingLabels,
  useLabels,
  useSupportsLabels,
  useTasksActions,
} from '@/hooks/useTasks';
import { useMode, useStatus } from '@/hooks/useTimer';

export default function Filter() {
  const status = useStatus();
  const mode = useMode();
  const labels = useLabels();
  const activeLabel = useActiveLabel();
  const isLoadingLabels = useIsLoadingLabels();
  const { onLabelChange } = useTasksActions();
  const supportsLabels = useSupportsLabels();

  if (!supportsLabels) {
    return null;
  }

  return (
    <Select
      size="sm"
      radius="sm"
      selectionMode="single"
      label="Filter by label"
      isLoading={isLoadingLabels}
      isDisabled={status === 'running' && mode === 'focus'}
      classNames={{
        trigger: 'bg-secondary data-[hover=true]:bg-secondary',
        popoverContent: 'bg-background',
      }}
      selectedKeys={activeLabel !== '' ? [activeLabel] : []}
      onChange={(e) => {
        onLabelChange(e.target.value);
      }}
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
