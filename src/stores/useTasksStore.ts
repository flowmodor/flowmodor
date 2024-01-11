import { Task } from '@/types';
import { create } from 'zustand';

interface TasksState {
  tasks: Task[];
  focusingTask: number | null;
  addTask: (task: Task) => void;
  completeTask: (key: number) => void;
  focusTask: (key: number) => void;
}

const useTasksStore = create<TasksState>((set) => ({
  tasks: [],
  focusingTask: null,
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  completeTask: (key) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.key !== key),
      focusingTask: key === state.focusingTask ? null : state.focusingTask,
    })),
  focusTask: (key) => set(() => ({ focusingTask: key })),
}));

export default useTasksStore;
