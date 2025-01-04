import { Tooltip } from '@nextui-org/tooltip';
import { Activity, ActivityCalendar } from 'react-activity-calendar';
import { usePeriod, useStatsActions } from '@/hooks/useStats';

function formatHoursAndMinutes(hours: number): string {
  const intHours = Math.floor(hours);
  const minutes = Math.floor((hours - intHours) * 60);
  return `${intHours}hr ${minutes}min`;
}

export default function Heatmap({ data }: { data: Activity[] }) {
  const { setDate, setWeek } = useStatsActions();
  const currentPeriod = usePeriod();

  const handleCellClick = (date: Date) => {
    if (currentPeriod === 'Week') {
      setWeek(date);
    } else {
      setDate(date);
    }
  };

  const today = new Date().toLocaleDateString('en-CA');

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
        ...data,
        ...(data.some((item) => item.date === today)
          ? []
          : [
              {
                date: today,
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
          content={`${
            activity.count <= 1 / 60
              ? 'no activity'
              : `flow for ${formatHoursAndMinutes(activity.count)}`
          } on ${new Date(activity.date).toDateString()}`}
          className="bg-secondary"
          classNames={{
            base: 'before:bg-secondary',
          }}
          closeDelay={0}
          disableAnimation
          showArrow
        >
          <g className="cursor-pointer">{block}</g>
        </Tooltip>
      )}
    />
  );
}
