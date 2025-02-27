import { Supabase, Task } from '@flowmodor/types';
import { TaskSource } from '.';

export default class TickTickSource implements TaskSource {
  private supabase: Supabase;
  private accessToken: string | null = null;
  public supportsLabels = true;

  constructor(supabase: Supabase) {
    this.supabase = supabase;
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken) return this.accessToken;
    const { data, error } = await this.supabase
      .from('integrations')
      .select('ticktick')
      .single();

    if (error || !data?.ticktick) {
      throw new Error('TickTick access token not found');
    }
    this.accessToken = data.ticktick;
    return this.accessToken;
  }

  async addTask(
    name: string,
    options: { listId: string; label: string },
  ): Promise<Task> {
    const accessToken = await this.getAccessToken();
    const response = await fetch('https://api.ticktick.com/open/v1/task', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        title: name,
        projectId: options.listId,
        tags: options.label ? [options.label] : [],
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
      labels: options.label ? [options.label] : [],
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

  async undoCompleteTask(taskId: string, listId: string): Promise<void> {
    const accessToken = await this.getAccessToken();

    const response = await fetch(
      `https://api.ticktick.com/open/v1/task/${taskId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: taskId,
          projectId: listId,
          status: 0,
        }),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to undo task completion');
    }
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
    const accessToken = await this.getAccessToken();
    const lists = await this.fetchLists();

    const allTags = new Set<string>();

    // Fetch tasks from each list and collect unique tags
    await Promise.all(
      lists.map(async (list) => {
        const response = await fetch(
          `https://api.ticktick.com/open/v1/project/${list.id}/data`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch tasks for labels');
        }

        const projectData = await response.json();
        projectData.tasks.forEach((task: any) => {
          if (task.tags) {
            task.tags.forEach((tag: string) => allTags.add(tag));
          }
        });
      }),
    );

    return Array.from(allTags);
  }
}
