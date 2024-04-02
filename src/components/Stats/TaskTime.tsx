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

export default function TaskTime({ isBlocked }: { isBlocked: boolean }) {
  const logs = useLogs();
  const taskTime = calculateTaskTime(logs ?? []);

  return (
    <Table
      radius="sm"
      color="secondary"
      className="h-full"
      classNames={{
        wrapper: 'h-full bg-[#23223C]',
        th: 'bg-secondary',
      }}
      aria-label="Table of each task and time spent on it"
    >
      <TableHeader>
        <TableColumn>Task</TableColumn>
        <TableColumn>Time</TableColumn>
      </TableHeader>
      <TableBody emptyContent="No tasks to display">
        {isBlocked
          ? []
          : taskTime.map((data) => (
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
