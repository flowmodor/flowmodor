/* eslint-disable @typescript-eslint/naming-convention */
import useTasksStore from '@/stores/useTasksStore';
import useTimerStore from '@/stores/useTimerStore';
import supabase from '@/utils/supabase';

async function log(
  mode: string,
  startTime: number,
  endTime: number,
  task: number | null,
) {
  const start_time = new Date(startTime).toISOString();
  const end_time = new Date(endTime).toISOString();

  await supabase.from('logs').insert([
    {
      mode,
      start_time,
      end_time,
      task,
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
