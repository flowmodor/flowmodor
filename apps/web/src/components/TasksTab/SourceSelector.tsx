'use client';

import { Select, SelectItem } from '@nextui-org/select';
import Link from 'next/link';
import {
  Source,
  useActiveSource,
  useIsLoadingSources,
  useSources,
  useTasksActions,
} from '@/stores/useTasksStore';
import { useMode, useStatus } from '@/stores/useTimerStore';

export default function SourceSelector() {
  const status = useStatus();
  const mode = useMode();
  const activeSource = useActiveSource();
  const { onSourceChange } = useTasksActions();
  const sources = useSources();
  const isLoadingSources = useIsLoadingSources();

  const selectItems = sources.map((source) => (
    <SelectItem
      key={source}
      classNames={{
        base: 'data-[focus=true]:!bg-secondary data-[hover=true]:!bg-secondary',
      }}
    >
      {source}
    </SelectItem>
  ));

  if (sources.length === 1 && !isLoadingSources) {
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
        Connect your favorite todo list app
      </SelectItem>,
    );
  }

  return (
    <Select
      size="sm"
      radius="sm"
      selectionMode="single"
      label="Task Source"
      isDisabled={status === 'running' && mode === 'focus'}
      isLoading={isLoadingSources}
      classNames={{
        trigger: 'bg-secondary data-[hover=true]:bg-secondary',
        popoverContent: 'bg-background',
      }}
      selectedKeys={[activeSource]}
      onChange={(e) => {
        if (e.target.value === '') {
          return;
        }
        onSourceChange(e.target.value as Source);
      }}
    >
      {selectItems}
    </Select>
  );
}
