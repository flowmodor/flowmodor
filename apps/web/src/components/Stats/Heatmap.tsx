import { Tooltip } from '@nextui-org/tooltip';
import { ActivityCalendar } from 'react-activity-calendar';
import { usePeriod, useStatsActions } from '@/stores/useStatsStore';

type DataPoint = {
  date: string;
  value: number;
};

function formatHoursAndMinutes(hours: number): string {
  const intHours = Math.floor(hours);
  const minutes = Math.floor((hours - intHours) * 60);
  return `${intHours}hr ${minutes}min`;
}

export default function Heatmap({ data }: { data: DataPoint[] }) {
  const { setDate, setWeek } = useStatsActions();
  const currentPeriod = usePeriod();

  const maxValue = Math.max(...data.map((d) => d.value), 0);

  const handleCellClick = (date: Date) => {
    if (currentPeriod === 'Week') {
      setWeek(date);
    } else {
      setDate(date);
    }
  };

  return (
    <ActivityCalendar
      blockMargin={3}
      blockRadius={5}
      blockSize={15}
      fontSize={12}
      showWeekdayLabels
      hideColorLegend
      hideTotalCount
      theme={{
        dark: ['#131221', '#DBBFFF'],
      }}
      data={[
        {
          date: new Date(
            new Date().setFullYear(new Date().getFullYear() - 1),
          ).toLocaleDateString('en-CA'),
          count: 0,
          level: 0,
        },
        ...data.map((item) => ({
          date: new Date(item.date).toLocaleDateString('en-CA'),
          count: item.value,
          level: Math.round(4 * (item.value / maxValue)),
        })),
        ...(data.some(
          (item) =>
            new Date(item.date).toLocaleDateString('en-CA') ===
            new Date().toLocaleDateString('en-CA'),
        )
          ? []
          : [
              {
                date: new Date().toLocaleDateString('en-CA'),
                count: 0,
                level: 0,
              },
            ]),
      ]}
      eventHandlers={{
        onClick: () => (activity) => {
          handleCellClick(new Date(activity.date));
        },
      }}
      renderBlock={(block, activity) => (
        <Tooltip
          radius="sm"
          offset={9}
          content={`${activity.date}: ${formatHoursAndMinutes(activity.count)}`}
          className="bg-secondary"
          classNames={{
            base: 'before:bg-secondary',
          }}
          closeDelay={0}
          showArrow
        >
          <g className="cursor-pointer">{block}</g>
        </Tooltip>
      )}
    />
  );
}
