import { Period } from '@flowmodor/stores/stats';
import { Select, SelectItem } from '@heroui/select';
import { usePeriod, useStatsActions } from '@/hooks/useStats';

export default function PeriodSelector() {
  const { onPeriodChange } = useStatsActions();
  const period = usePeriod();

  return (
    <Select
      radius="sm"
      selectionMode="single"
      classNames={{
        trigger: 'bg-secondary data-[hover=true]:bg-secondary',
        popoverContent: 'bg-background',
        base: 'max-w-[6rem]',
      }}
      selectedKeys={[period]}
      onChange={(e) => {
        const newPeriod = e.target.value;
        if (newPeriod !== '') {
          onPeriodChange(newPeriod as Period);
        }
      }}
      aria-label="Select period"
    >
      <SelectItem
        key="Day"
        classNames={{
          base: 'data-[focus=true]:!bg-secondary data-[hover=true]:!bg-secondary',
        }}
      >
        Day
      </SelectItem>
      <SelectItem
        key="Week"
        textValue="Week"
        classNames={{
          base: 'data-[focus=true]:!bg-secondary data-[hover=true]:!bg-secondary',
        }}
      >
        <div className="flex items-center gap-2">Week</div>
      </SelectItem>
    </Select>
  );
}
