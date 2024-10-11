'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/table';
import { useLogs } from '@/stores/useStatsStore';
import { calculateTaskTime } from '@/utils/stats/calculateTaskTime';

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

  return (
    <Table
      radius="sm"
      color="secondary"
      className="h-full"
      classNames={{
        base: 'overflow-y-auto',
        wrapper: 'h-full bg-midground',
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
  );
}
