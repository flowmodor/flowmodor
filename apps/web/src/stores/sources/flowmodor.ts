/* eslint-disable class-methods-use-this */
import { Task } from '@flowmodor/types';
import { SupabaseClient } from '@supabase/supabase-js';
import { TaskSource } from '.';

export default class FlowmodorSource implements TaskSource {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  async addTask(name: string): Promise<Task> {
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
    const { error } = await this.supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) throw error;
  }

  async completeTask(taskId: string): Promise<void> {
    const { error } = await this.supabase
      .from('tasks')
      .update({ completed: true })
      .eq('id', taskId);

    if (error) throw error;
  }

  async undoCompleteTask(taskId: string): Promise<void> {
    const { error } = await this.supabase
      .from('tasks')
      .update({ completed: false })
      .eq('id', taskId);

    if (error) throw error;
  }

  async fetchTasks(): Promise<Task[]> {
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
