import { List, Task } from '@flowmodor/types';

export enum Source {
  Flowmodor = 'Flowmodor',
  Todoist = 'Todoist',
  TickTick = 'TickTick',
}

export interface TaskSource {
  addTask(
    name: string,
    options?: {
      listId?: string;
      label?: string;
    },
  ): Promise<Task>;
  deleteTask(taskId: string, listId?: string): Promise<void>;
  completeTask(taskId: string, listId?: string): Promise<void>;
  undoCompleteTask(taskId: string): Promise<void>;
  fetchTasks(listId?: string): Promise<Task[]>;
  fetchLists(): Promise<List[]>;
  fetchLabels(): Promise<string[]>;
}
