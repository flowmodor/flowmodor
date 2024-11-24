import { Supabase, Task } from '@flowmodor/types';
import { TaskSource } from '.';

export default class FlowmodorSource implements TaskSource {
  private supabase: Supabase;

  constructor(supabase: Supabase) {
    this.supabase = supabase;
  }

  async addTask(name: string): Promise<Task> {
    const generateId = () => {
      return `${Date.now()}-${Math.random().toString(36)}`;
    };

    const {
      data: { session },
    } = await this.supabase.auth.getSession();

    if (!session) {
      return {
        id: generateId(),
        name,
        completed: false,
      };
    }

    const { data, error } = await this.supabase
      .from('tasks')
      .insert([{ name }])
      .select();

    if (error) throw error;

    return {
      ...data[0],
      id: data[0].id.toString(),
      completed: false,
    };
  }

  async deleteTask(taskId: string): Promise<void> {
    const {
      data: { session },
    } = await this.supabase.auth.getSession();

    if (!session) {
      return;
    }

    const { error } = await this.supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) throw error;
  }

  async completeTask(taskId: string): Promise<void> {
    const {
      data: { session },
    } = await this.supabase.auth.getSession();

    if (!session) {
      return;
    }

    const { error } = await this.supabase
      .from('tasks')
      .update({ completed: true })
      .eq('id', taskId);

    if (error) throw error;
  }

  async undoCompleteTask(taskId: string): Promise<void> {
    const {
      data: { session },
    } = await this.supabase.auth.getSession();

    if (!session) {
      return;
    }

    const { error } = await this.supabase
      .from('tasks')
      .update({ completed: false })
      .eq('id', taskId);

    if (error) throw error;
  }

  async fetchTasks(): Promise<Task[]> {
    const {
      data: { session },
    } = await this.supabase.auth.getSession();

    if (!session) {
      return [];
    }

    const { data, error } = await this.supabase
      .from('tasks')
      .select('*')
      .is('completed', false);

    if (error) throw error;

    return data.map((task) => ({
      ...task,
      id: task.id.toString(),
    }));
  }

  async fetchLists(): Promise<{ name: string; id: string }[]> {
    return [];
  }

  async fetchLabels(): Promise<string[]> {
    return [];
  }
}
