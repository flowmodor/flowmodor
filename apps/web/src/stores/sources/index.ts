import { List, Task } from '@flowmodor/types';

export enum Source {
  Flowmodor = 'Flowmodor',
  Todoist = 'Todoist',
  TickTick = 'TickTick',
  GoogleTasks = 'Google Tasks',
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
  undoCompleteTask(taskId: string, listId: string | null): Promise<void>;
  fetchTasks(listId?: string): Promise<Task[]>;
  fetchLists(): Promise<List[]>;
  fetchLabels(): Promise<string[]>;
}
