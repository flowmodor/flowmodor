import { TaskSource } from '@flowmodor/task-sources';
import { List, Task } from '@flowmodor/types';
import { SupabaseClient } from '@supabase/supabase-js';
import { refreshToken } from '@/actions/microsofttodo';

export default class MicrosoftTodoSource implements TaskSource {
  private supabase: SupabaseClient;

  private baseUrl = 'https://graph.microsoft.com/v1.0/me/todo';

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  private async getAccessToken(): Promise<string> {
    const { data, error } = await this.supabase
      .from('integrations')
      .select('microsofttodo')
      .single();

    if (error || !data?.microsofttodo) {
      throw new Error('Microsoft Todo access token not found');
    }

    return data.microsofttodo.access_token;
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
        .select('microsofttodo')
        .single();

      if (!data?.microsofttodo?.refresh_token) {
        throw new Error('Refresh token not found');
      }

      const newAccessToken = await refreshToken(
        data.microsofttodo.refresh_token,
      );

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

  async addTask(
    name: string,
    options: { listId: string; label: string },
  ): Promise<Task> {
    const accessToken = await this.getAccessToken();

    const response = await this.makeRequest(
      `${this.baseUrl}/lists/${options.listId}/tasks`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: name,
          status: 'notStarted',
          categories: options.label ? [options.label] : [],
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
      due: task.dueDateTime ? new Date(task.dueDateTime) : null,
      labels: task.categories || [],
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
          status: 'notStarted',
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
      `${this.baseUrl}/lists/${listId}/tasks?$filter=status ne 'completed'`,
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
    return (data.value || []).map((task: any) => ({
      id: task.id,
      name: task.title,
      completed: task.status === 'completed',
      labels: task.categories,
      due: task.dueDateTime?.dateTime
        ? new Date(task.dueDateTime.dateTime)
        : null,
    }));
  }

  async fetchLists(): Promise<List[]> {
    const accessToken = await this.getAccessToken();

    const response = await this.makeRequest(`${this.baseUrl}/lists`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch lists');
    }

    const data = await response.json();
    return (data.value || [])
      .filter((list: any) => list.displayName !== 'Flagged Emails')
      .map((list: any) => ({
        id: list.id,
        name: list.displayName,
      }));
  }

  async fetchLabels(): Promise<string[]> {
    const accessToken = await this.getAccessToken();
    const lists = await this.fetchLists();

    const categoriesSet = new Set<string>();

    await Promise.all(
      lists.map(async (list) => {
        const response = await this.makeRequest(
          `${this.baseUrl}/lists/${list.id}/tasks`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch tasks for categories');
        }

        const data = await response.json();
        (data.value || []).forEach((task: any) => {
          if (task.categories && Array.isArray(task.categories)) {
            task.categories.forEach((category: string) => {
              categoriesSet.add(category);
            });
          }
        });
      }),
    );

    return Array.from(categoriesSet);
  }
}
