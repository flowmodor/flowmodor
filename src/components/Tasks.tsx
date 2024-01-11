'use client';

/* eslint-disable jsx-a11y/control-has-associated-label */

import { Card, CardBody } from '@nextui-org/card';
import { useState } from 'react';
import { Task } from '@/types';
import { Button } from '@nextui-org/button';
import TaskBox from './TaskBox';
import { Plus } from './Icons';

const initTasks: Task[] = [];

export default function Tasks() {
  const [tasks, setTasks] = useState(initTasks);
  const [inputValue, setInputValue] = useState<string>('');

  const onCompleted = (task: Task) => {
    setTasks(tasks.filter((t) => t.key !== task.key));
  };

  const onAddTask = (name: string | undefined) => {
    if (!name) {
      return;
    }

    setTasks([
      ...tasks,
      {
        key: tasks.length + 1,
        name,
      },
    ]);
  };

  return (
    <div className="flex flex-col gap-5">
      <Card className="h-[30rem] w-[30rem] bg-[#23223C]">
        <CardBody>
          <div className="flex w-full flex-col gap-3 overflow-y-scroll scrollbar-hide">
            {tasks.map((task) => (
              <div key={task.key}>
                <TaskBox task={task} onCompleted={onCompleted} />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
      <Card className="bg-[#23223C]">
        <CardBody>
          <div className="flex shrink-0 items-center justify-between px-4">
            <input
              className="w-full bg-transparent pr-5 outline-none"
              placeholder="Enter task name"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (inputValue.trim() === '') {
                  return;
                }

                if (e.key === 'Enter') {
                  onAddTask(inputValue.trim());
                  setInputValue('');
                }
              }}
            />
            <Button
              type="button"
              variant="flat"
              isIconOnly
              onClick={() => {
                if (inputValue.trim() === '') {
                  return;
                }
                onAddTask(inputValue.trim());
                setInputValue('');
              }}
              className={`bg-secondary transition ${
                inputValue.trim() !== ''
                  ? 'cursor-pointer fill-primary'
                  : 'cursor-auto fill-white'
              }`}
            >
              <Plus />
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
