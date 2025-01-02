import { TaskSource } from '@flowmodor/task-sources';
import { List, Task } from '@flowmodor/types';
import { SupabaseClient } from '@supabase/supabase-js';
import { refreshToken } from '@/actions/googletasks';

export default class GoogleTasksSource implements TaskSource {
  private supabase: SupabaseClient;

  private baseUrl = 'https://tasks.googleapis.com/tasks/v1';

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  private async getAccessToken(): Promise<string> {
    const { data, error } = await this.supabase
      .from('integrations')
      .select('googletasks')
      .single();

    if (error || !data?.googletasks) {
      throw new Error('Google Tasks access token not found');
    }

    return data.googletasks.access_token;
  }

  private async makeRequest(
    url: string,
    options: RequestInit,
    isRetry = false,
  ): Promise<Response> {
    const response = await fetch(url, options);

    if (response.status === 401 && !isRetry) {
      const { data } = await this.supabase
        .from('integrations')
        .select('googletasks')
        .single();

      if (!data?.googletasks?.refresh_token) {
        throw new Error('Refresh token not found');
      }

      const newAccessToken = await refreshToken(data.googletasks.refresh_token);

      const newOptions = {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newAccessToken}`,
        },
      };

      return this.makeRequest(url, newOptions, true);
    }

    return response;
  }

  async addTask(name: string, options?: { listId?: string }): Promise<Task> {
    const accessToken = await this.getAccessToken();
    const listId = options?.listId ?? '@default';

    const response = await this.makeRequest(
      `${this.baseUrl}/lists/${listId}/tasks`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: name,
          status: 'needsAction',
        }),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to add task');
    }

    const task = await response.json();
    return {
      id: task.id,
      name: task.title,
      completed: task.status === 'completed',
    };
  }

  async deleteTask(taskId: string, listId: string): Promise<void> {
    const accessToken = await this.getAccessToken();

    const response = await this.makeRequest(
      `${this.baseUrl}/lists/${listId}/tasks/${taskId}`,
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

    const response = await this.makeRequest(
      `${this.baseUrl}/lists/${listId}/tasks/${taskId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'completed',
        }),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to complete task');
    }
  }

  async undoCompleteTask(taskId: string, listId: string): Promise<void> {
    const accessToken = await this.getAccessToken();

    const response = await this.makeRequest(
      `${this.baseUrl}/lists/${listId}/tasks/${taskId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'needsAction',
        }),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to undo task completion');
    }
  }

  async fetchTasks(listId: string): Promise<Task[]> {
    const accessToken = await this.getAccessToken();

    const response = await this.makeRequest(
      `${this.baseUrl}/lists/${listId}/tasks?showCompleted=False`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }

    const data = await response.json();
    return (data.items || []).map((task: any) => ({
      id: task.id,
      name: task.title,
      completed: task.status === 'completed',
      due: task.due ? new Date(task.due) : null,
    }));
  }

  async fetchLists(): Promise<List[]> {
    const accessToken = await this.getAccessToken();

    const response = await this.makeRequest(`${this.baseUrl}/users/@me/lists`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch lists');
    }

    const data = await response.json();
    return (data.items || []).map((list: any) => ({
      id: list.id,
      name: list.title,
    }));
  }

  async fetchLabels(): Promise<string[]> {
    return [];
  }
}
