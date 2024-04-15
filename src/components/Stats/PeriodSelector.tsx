import { Chip } from '@nextui-org/chip';
import { Select, SelectItem } from '@nextui-org/select';
import { Period, usePeriod, useStatsActions } from '@/stores/useStatsStore';

export default function PeriodSelector() {
  const { onPeriodChange } = useStatsActions();
  const period = usePeriod();
  const periods: Period[] = ['Day', 'Week'];

  return (
    <Select
      size="sm"
      radius="sm"
      selectionMode="single"
      label="Select a period"
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
      {periods.map((p) => (
        <SelectItem
          key={p}
          textValue={p}
          classNames={{
            base: 'data-[focus=true]:!bg-secondary data-[hover=true]:!bg-secondary',
          }}
        >
          {p === 'Week' ? (
            <div className="flex gap-2 items-center">
              {p}
              <Chip size="sm" radius="sm" color="primary">
                Pro
              </Chip>
            </div>
          ) : (
            p
          )}
        </SelectItem>
      ))}
    </Select>
  );
}
