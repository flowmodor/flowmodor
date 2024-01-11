import { Card, CardBody } from '@nextui-org/card';
import { Hide, Play, Show, Stop } from '@/components/Icons';
import { Select, SelectItem } from '@nextui-org/select';
import { Button } from '@nextui-org/button';
import { CircularProgress } from '@nextui-org/progress';
import { useEffect, useState } from 'react';
import { formatTime } from '@/utils';
import useTimerStore from '@/stores/useTimerStore';
import useTasksStore from '@/stores/useTasksStore';

export default function Timer() {
  const {
    startTime,
    endTime,
    totalTime,
    mode,
    showTime,
    isRunning,
    startTimer,
    stopTimer,
    toggleShowTime,
  } = useTimerStore((state) => state);

  const { tasks, focusingTask, focusTask } = useTasksStore((state) => state);

  const [tick, setTick] = useState(0);
  const [displayTime, setDisplayTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTick(tick + 1);
      }, 1000);
    }

    let time;
    if (isRunning) {
      time = mode === 'focus' ? Date.now() - startTime! : endTime! - Date.now();
    } else {
      time = mode === 'focus' ? 0 : (endTime! - startTime!) / 5;
    }
    setDisplayTime(Math.floor(time / 1000));

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [tick, isRunning]);

  return (
    <div className="flex flex-col gap-5">
      <Card className="h-[30rem] w-[30rem] bg-[#23223C]">
        <CardBody>
          <div className="flex h-full flex-col items-center justify-center">
            <Select
              isDisabled={isRunning || tasks.length === 0}
              selectionMode="single"
              selectedKeys={focusingTask ? [focusingTask.toString()] : []}
              label="Select a task"
              size="sm"
              radius="sm"
              classNames={{
                base: 'w-64',
                trigger: 'bg-secondary data-[hover=true]:bg-secondary',
                popoverContent: 'bg-[#131221] data-[hover=true]:bg-white',
                listboxWrapper: 'data-[focus=true]:bg-white',
              }}
              onChange={(e) => {
                focusTask(parseInt(e.target.value, 10));
              }}
            >
              {tasks.map((task) => (
                <SelectItem key={task.key} value={task.name}>
                  {task.name}
                </SelectItem>
              ))}
            </Select>
            <CircularProgress
              value={
                mode === 'focus'
                  ? 0
                  : 100 * (displayTime / Math.floor(totalTime! / 1000))
              }
              size="lg"
              showValueLabel
              aria-label="Timer progress"
              valueLabel={
                <div className="flex flex-col items-center gap-2">
                  {showTime ? formatTime(displayTime) : '**:**'}
                  <span className="text-2xl">
                    {mode === 'focus' ? 'Focus' : 'Break'}
                  </span>
                </div>
              }
              classNames={{
                svg: 'w-80 h-80 text-primary',
                track: 'stroke-secondary',
                value: 'text-5xl font-semibold',
              }}
            />
          </div>
        </CardBody>
      </Card>
      <Card className="bg-[#23223C]">
        <CardBody>
          <div className="flex items-center justify-center gap-5">
            <Button
              type="button"
              variant="flat"
              isIconOnly
              className="bg-secondary"
              onPress={toggleShowTime}
            >
              {showTime ? <Hide /> : <Show />}
            </Button>
            <Button
              type="button"
              variant="flat"
              isIconOnly
              className="bg-secondary"
              onPress={isRunning ? stopTimer : startTimer}
            >
              {isRunning ? <Stop /> : <Play />}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
