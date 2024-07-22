import { Tooltip } from '@nextui-org/react';
import { eachDayOfInterval, endOfYear, format, startOfYear } from 'date-fns';
import { useStatsActions } from '@/stores/useStatsStore';

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
  return `${intHours}h ${minutes}m`;
}

export default function Heatmap({ data }: { data: DataPoint[] }) {
  const { setDate } = useStatsActions();
  const currentYear = new Date().getFullYear();
  const startDate = startOfYear(new Date(currentYear, 0, 1));
  const endDate = endOfYear(new Date(currentYear, 0, 1));
  const dataMap = new Map(data.map((item) => [item.date, item.value]));
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });
  const weeks = allDays.reduce((acc: Date[][], date, index) => {
    if (index % 7 === 0) acc.push([]);
    acc[acc.length - 1].push(date);
    return acc;
  }, []);
  const maxValue = Math.max(...data.map((d) => d.value), 0.1);
  const minValue = Math.min(...data.map((d) => d.value), 0);
  const getColor = (value: number) =>
    interpolateColor(value, minValue, maxValue);

  return (
    <div className="flex flex-col items-start">
      <div className="flex gap-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const value = dataMap.get(dateStr) || 0;
              return (
                <Tooltip
                  key={dateStr}
                  showArrow
                  radius="sm"
                  content={`${dateStr}: ${formatHoursAndMinutes(value)}`}
                  className="bg-background"
                  classNames={{
                    base: 'before:bg-background',
                  }}
                  isDisabled={value === 0}
                >
                  <button
                    type="button"
                    className="w-4 h-4 rounded-[4px]"
                    style={{ backgroundColor: getColor(value) }}
                    aria-label={dateStr}
                    onClick={() => {
                      setDate(new Date(dateStr));
                    }}
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
