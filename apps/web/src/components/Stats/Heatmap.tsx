import { Tooltip } from '@nextui-org/react';
import {
  addDays,
  eachDayOfInterval,
  endOfYear,
  format,
  getDay,
  startOfYear,
} from 'date-fns';
import { usePeriod, useStatsActions } from '@/stores/useStatsStore';

type DataPoint = {
  date: string;
  value: number;
};

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function interpolateColor(value: number, min: number, max: number): string {
  const ratio = (value - min) / (max - min);
  const r = Math.round(lerp(0x13, 0xdb, ratio));
  const g = Math.round(lerp(0x12, 0xbf, ratio));
  const b = Math.round(lerp(0x21, 0xff, ratio));
  return `#${r.toString(16).padStart(2, '0')}${g
    .toString(16)
    .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function formatHoursAndMinutes(hours: number): string {
  const intHours = Math.floor(hours);
  const minutes = Math.round((hours - intHours) * 60);
  return `${intHours}hr ${minutes}min`;
}

export default function Heatmap({ data }: { data: DataPoint[] }) {
  const { setDate, setWeek } = useStatsActions();
  const currentYear = new Date().getFullYear();
  const startDate = startOfYear(new Date(currentYear, 0, 1));
  const endDate = endOfYear(new Date(currentYear, 0, 1));
  const dataMap = new Map(data.map((item) => [item.date, item.value]));
  const currentPeriod = usePeriod();

  // Adjust the start date to the previous Sunday if it's not already a Sunday
  const adjustedStartDate =
    getDay(startDate) === 0
      ? startDate
      : addDays(startDate, -getDay(startDate));

  const allDays = eachDayOfInterval({ start: adjustedStartDate, end: endDate });

  // Group days into weeks, starting from Sunday
  const weeks = allDays.reduce((acc: Date[][], date, index) => {
    if (index % 7 === 0) acc.push([]);
    if (date >= startDate) {
      acc[acc.length - 1].push(date);
    }
    return acc;
  }, []);

  const maxValue = Math.max(...data.map((d) => d.value), 0);
  const getColor = (value: number) => interpolateColor(value, 0, maxValue);

  const handleCellClick = (date: Date) => {
    if (currentPeriod === 'Week') {
      setWeek(date);
    } else {
      setDate(date);
    }
  };

  return (
    <div className="flex flex-col items-start">
      <div className="flex gap-1">
        {weeks.map((week, weekIndex) => (
          <div
            key={weekIndex}
            className={`flex flex-col gap-1 ${
              weekIndex === 0 && 'justify-end'
            }`}
          >
            {week.map((day) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const value = dataMap.get(dateStr) || 0;
              const dayOfWeek = format(day, 'EEE');
              return (
                <Tooltip
                  key={dateStr}
                  radius="sm"
                  offset={9}
                  content={`${dayOfWeek}, ${dateStr}: ${formatHoursAndMinutes(
                    value,
                  )}`}
                  className="bg-background"
                  classNames={{
                    base: 'before:bg-background',
                  }}
                  isDisabled={value === 0}
                  closeDelay={0}
                >
                  <button
                    type="button"
                    className="w-4 h-4 rounded-[4px] hover:border-2 hover:border-primary"
                    style={{ backgroundColor: getColor(value) }}
                    aria-label={dateStr}
                    onClick={() => handleCellClick(new Date(dateStr))}
                  />
                </Tooltip>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
