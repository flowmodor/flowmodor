import { Tables } from '@/types/supabase';

export type LogsWithTasks = Tables<'logs'> & {
  tasks: {
    name: string;
  } | null;
};

export function calculateTaskTime(logs: LogsWithTasks[]) {
  const taskTimeMap: { [task: string]: number } = {};
  for (let i = 0; i < logs.length; i += 1) {
    if (logs[i].mode === 'focus') {
      const task = logs[i].task === null ? 'unspecified' : logs[i].tasks!.name;
      const time =
        (new Date(logs[i].end_time).getTime() -
          new Date(logs[i].start_time).getTime()) /
        60000;
      if (taskTimeMap[task]) {
        taskTimeMap[task] += time;
      } else {
        taskTimeMap[task] = time;
      }
    }
  }

  const taskTimeArray = Object.keys(taskTimeMap).map((task) => ({
    name: task,
    time: taskTimeMap[task],
  }));

  return taskTimeArray;
}
