'use client';

import { Card } from '@nextui-org/card';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/table';
import { useLogs } from '@/hooks/useStats';
import { calculateFocusTime } from '@/utils/stats/calculateFocusTime';
import { calculateTaskTime } from '@/utils/stats/calculateTaskTime';
import TimeFormatter from './TimeFormatter';

const formatTime = (time: number) => {
  const hours = Math.floor(time / 60);
  const minutes = Math.floor(time % 60);
  const seconds = Math.floor((time % 1) * 60);

  if (time < 1) {
    return `${seconds} sec`;
  }

  let result = '';
  if (hours > 0) {
    result += `${hours} hr `;
  }
  if (minutes > 0) {
    result += `${minutes} min`;
  }
  return result.trim();
};

export default function TaskTime() {
  const logs = useLogs();
  const taskTime = calculateTaskTime(logs ?? []);
  const { totalFocusTime, longestFocusTime } = calculateFocusTime(logs ?? []);

  return (
    <Card className="h-full w-full shrink-0 gap-5 bg-midground p-5">
      <div className="flex shrink-0 flex-row justify-center gap-10">
        <div className="flex flex-col items-center text-sm">
          Total Focus
          <TimeFormatter minutes={totalFocusTime} />
        </div>
        <div className="flex flex-col items-center text-sm">
          Longest Focus
          <TimeFormatter minutes={longestFocusTime} />
        </div>
      </div>
      <Table
        radius="sm"
        color="secondary"
        removeWrapper
        className="h-full"
        classNames={{
          base: 'overflow-y-auto max-h-[70vh]',
          th: 'bg-secondary',
        }}
        aria-label="Table of each task and time spent on it"
        isHeaderSticky
      >
        <TableHeader>
          <TableColumn>Task</TableColumn>
          <TableColumn>Time</TableColumn>
        </TableHeader>
        <TableBody emptyContent="No tasks to display">
          {taskTime.map((data) => (
            <TableRow key={data.name}>
              <TableCell>{data.name}</TableCell>
              <TableCell>{formatTime(data.time)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
