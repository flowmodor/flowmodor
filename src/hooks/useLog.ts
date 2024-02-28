/* eslint-disable @typescript-eslint/naming-convention */
import useTasksStore from '@/stores/useTasksStore';
import useTimerStore from '@/stores/useTimerStore';
import supabase from '@/utils/supabase';

export default function useLog() {
  const { mode, startTime } = useTimerStore((state) => state);
  const { focusingTask, activeList } = useTasksStore((state) => state);
  const endTime = Date.now();

  async function log() {
    const start_time = new Date(startTime!).toISOString();
    const end_time = new Date(endTime).toISOString();

    if (!focusingTask) {
      await supabase.from('logs').insert([
        {
          mode,
          start_time,
          end_time,
        },
      ]);
      return;
    }

    const hasId = activeList === 'Flowmodor - default';
    await supabase.from('logs').insert([
      {
        mode,
        start_time,
        end_time,
        task_id: hasId ? focusingTask.id : null,
        task_name: hasId ? null : focusingTask.name,
      },
    ]);
  }

  return {
    log,
  };
}
