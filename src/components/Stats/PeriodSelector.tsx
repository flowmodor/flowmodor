import { Select, SelectItem } from '@nextui-org/select';
import { Period, usePeriod, useStatsActions } from '@/stores/useStatsStore';

export default function PeriodSelector() {
  const { onPeriodChange } = useStatsActions();
  const period = usePeriod();

  return (
    <Select
      size="sm"
      radius="sm"
      selectionMode="single"
      label="Select stats period"
      classNames={{
        trigger: 'bg-secondary data-[hover=true]:bg-secondary',
        popoverContent: 'bg-background',
        base: 'absolute left-5 top-5 max-w-[10rem]',
      }}
      selectedKeys={[period]}
      onChange={(e) => {
        const newPeriod = e.target.value;
        if (newPeriod !== '') {
          onPeriodChange(newPeriod as Period);
        }
      }}
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
        <div className="flex gap-2 items-center">Week</div>
      </SelectItem>
    </Select>
  );
}
