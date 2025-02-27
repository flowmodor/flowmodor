import { Supabase, Task } from '@flowmodor/types';
import { TaskSource } from '.';

export default class TodoistSource implements TaskSource {
  private supabase: Supabase;
  private accessToken: string | null = null;
  private cachedLists: { name: string; id: string }[] | null = null;
  public supportsLabels = true;

  constructor(supabase: Supabase) {
    this.supabase = supabase;
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken) return this.accessToken;
    const { data, error } = await this.supabase
      .from('integrations')
      .select('todoist')
      .single();

    if (error || !data?.todoist) {
      throw new Error('Todoist access token not found');
    }
    this.accessToken = data.todoist;
    return this.accessToken;
  }

  async addTask(
    name: string,
    options: { listId: string; label: string },
  ): Promise<Task> {
    const token = await this.getAccessToken();
    const response = await fetch('https://api.todoist.com/rest/v2/tasks', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: name,
        ...(options.listId !== 'all' &&
          options.listId !== 'today' && { project_id: options.listId }),
        ...(options.listId === 'today' && { due_string: 'today' }),
        ...(options.label && { labels: [options.label] }),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to add task');
    }

    const task = await response.json();
    return {
      id: task.id.toString(),
      name: task.content,
      completed: false,
      ...(options.label && { labels: [options.label] }),
    };
  }

  async deleteTask(taskId: string): Promise<void> {
    const token = await this.getAccessToken();
    const response = await fetch(
      `https://api.todoist.com/rest/v2/tasks/${taskId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error('Failed to delete task');
    }
  }

  async completeTask(taskId: string): Promise<void> {
    const token = await this.getAccessToken();
    const response = await fetch(
      `https://api.todoist.com/rest/v2/tasks/${taskId}/close`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to complete task');
    }
  }

  async undoCompleteTask(taskId: string): Promise<void> {
    const token = await this.getAccessToken();
    const response = await fetch(
      `https://api.todoist.com/rest/v2/tasks/${taskId}/reopen`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to undo complete task');
    }
  }

  async fetchTasks(listId: string): Promise<Task[]> {
    const token = await this.getAccessToken();
    const lists = await this.fetchLists();
    const listName = lists.find((list) => list.id === listId)?.name;

    let filter = '';
    if (listId === 'all') {
      filter = '';
    } else if (listId === 'today') {
      filter = 'today';
    } else if (listName) {
      filter = `#${listName}`;
    }

    const params = new URLSearchParams();
    if (filter) {
      params.set('filter', filter);
    }

    const response = await fetch(
      `https://api.todoist.com/rest/v2/tasks?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }

    const tasks = await response.json();
    return tasks.map((task: any) => ({
      id: task.id,
      name: task.content,
      completed: false,
      labels: task.labels || task.label_ids,
      due: task.due && task.due.date ? new Date(task.due.date) : null,
    }));
  }

  async fetchLists(): Promise<{ name: string; id: string }[]> {
    if (this.cachedLists) {
      return this.cachedLists;
    }

    const token = await this.getAccessToken();
    const response = await fetch('https://api.todoist.com/rest/v2/projects', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }

    const projects = await response.json();

    const lists = [
      { name: 'Today', id: 'today' },
      ...projects.map((project: any) => ({
        name: project.name,
        id: project.id,
      })),
      { name: 'All', id: 'all' },
    ];
    this.cachedLists = lists;

    return lists;
  }

  async fetchLabels(): Promise<string[]> {
    const token = await this.getAccessToken();
    const response = await fetch('https://api.todoist.com/rest/v2/labels', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch labels');
    }

    const labels = await response.json();
    return labels.map((label: any) => label.name);
  }
}
