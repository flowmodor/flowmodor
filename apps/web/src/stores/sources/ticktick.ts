/* eslint-disable class-methods-use-this */
import { Task } from '@flowmodor/types';
import { SupabaseClient } from '@supabase/supabase-js';
import { TaskSource } from '.';

export default class TickTickSource implements TaskSource {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  private async getAccessToken(): Promise<string> {
    const { data, error } = await this.supabase
      .from('integrations')
      .select('ticktick')
      .single();

    if (error || !data?.ticktick) {
      throw new Error('TickTick access token not found');
    }

    return data.ticktick;
  }

  async addTask(name: string, options: { listId: string }): Promise<Task> {
    const accessToken = await this.getAccessToken();

    const response = await fetch('https://api.ticktick.com/open/v1/task', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        title: name,
        projectId: options.listId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to add task');
    }

    const { id } = await response.json();
    return {
      id,
      name,
      completed: false,
    };
  }

  async deleteTask(taskId: string, listId: string): Promise<void> {
    const accessToken = await this.getAccessToken();

    const response = await fetch(
      `https://api.ticktick.com/open/v1/project/${listId}/task/${taskId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to delete task');
    }
  }

  async completeTask(taskId: string, listId: string): Promise<void> {
    const accessToken = await this.getAccessToken();

    const response = await fetch(
      `https://api.ticktick.com/open/v1/project/${listId}/task/${taskId}/complete`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to complete task');
    }
  }

  async undoCompleteTask(): Promise<void> {
    throw new Error('TickTick does not support undoing task completion');
  }

  async fetchTasks(listId: string): Promise<Task[]> {
    const accessToken = await this.getAccessToken();

    const response = await fetch(
      `https://api.ticktick.com/open/v1/project/${listId}/data`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }

    const projectData = await response.json();
    return projectData.tasks.map((task: any) => ({
      id: task.id,
      name: task.title,
      completed: false,
      labels: task.tags,
      due: task.dueDate ? new Date(task.dueDate) : null,
    }));
  }

  async fetchLists(): Promise<{ name: string; id: string }[]> {
    const accessToken = await this.getAccessToken();

    const response = await fetch('https://api.ticktick.com/open/v1/project', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch lists');
    }

    const lists = await response.json();
    return lists.map((list: any) => ({
      name: list.name,
      id: list.id,
    }));
  }

  async fetchLabels(): Promise<string[]> {
    return [];
  }
}
