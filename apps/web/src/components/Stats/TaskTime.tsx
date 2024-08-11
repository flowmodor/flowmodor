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
            <TableCell>
              {Math.floor(data.time / 60) > 0 ? (
                <span>{Math.floor(data.time / 60)} hr </span>
              ) : null}
              {data.time % 60 > 0 ? (
                <span>{Math.floor(data.time % 60)} min</span>
              ) : null}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
