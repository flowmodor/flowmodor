'use client';

import { Chip } from '@nextui-org/chip';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/table';
import { Tables } from '@/types/supabase';

export default function Subscriptions({ data }: { data: Tables<'plans'> }) {
  return (
    <div className="grid gap-5 mx-5 lg:mx-32">
      <h1 className="text-2xl font-semibold">Your subscription</h1>
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
          <TableColumn>Plan</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>End Time</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{data.plan}</TableCell>
            <TableCell>
              <Chip color="primary">{data.status}</Chip>
            </TableCell>
            <TableCell className="flex gap-10">
              {data.end_time ? (
                <span>{new Date(data.end_time).toDateString()}</span>
              ) : null}
              {data.next_billed_at ? (
                <span>
                  Renews automatically at{' '}
                  {new Date(data.next_billed_at).toDateString()}
                </span>
              ) : (
                <span>Renews cancelled</span>
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
