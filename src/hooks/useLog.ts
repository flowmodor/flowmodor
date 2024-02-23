/* eslint-disable @typescript-eslint/naming-convention */
import useTasksStore, { Task } from '@/stores/useTasksStore';
import useTimerStore from '@/stores/useTimerStore';
import supabase from '@/utils/supabase';
import getClient from '@/utils/todoist';

async function log(
  mode: string,
  startTime: number,
  endTime: number,
  task: Task | null,
) {
  const start_time = new Date(startTime).toISOString();
  const end_time = new Date(endTime).toISOString();

  console.log(task);

  if (!task) {
    await supabase.from('logs').insert([
      {
        mode,
        start_time,
        end_time,
      },
    ]);
    return;
  }

  const todoist = await getClient();
  await supabase.from('logs').insert([
    {
      mode,
      start_time,
      end_time,
      task: todoist ? null : task.id,
      task_name: todoist ? task.name : null,
    },
  ]);
}

export default function useLog() {
  const { mode, startTime } = useTimerStore((state) => state);
  const { focusingTask } = useTasksStore((state) => state);
  const endTime = Date.now();

  return {
    log: () => log(mode, startTime!, endTime, focusingTask),
  };
}
