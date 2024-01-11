import { Task } from '@/types';
import { create } from 'zustand';

interface TasksState {
  tasks: Task[];
  addTask: (task: Task) => void;
  completeTask: (key: number) => void;
}

const useTasksStore = create<TasksState>((set) => ({
  tasks: [],
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  completeTask: (key) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.key !== key),
    })),
}));

export default useTasksStore;
