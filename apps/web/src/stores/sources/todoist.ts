import { TodoistApi } from '@doist/todoist-api-typescript';
import { Task } from '@flowmodor/types';
import { SupabaseClient } from '@supabase/supabase-js';
import { TaskSource } from '.';

export default class TodoistSource implements TaskSource {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  private async getClient() {
    const { data } = await this.supabase
      .from('integrations')
      .select('todoist')
      .single();

    const todoistToken = data?.todoist;

    if (todoistToken) {
      return new TodoistApi(todoistToken);
    }
    throw new Error('Todoist client not initialized');
  }

  async addTask(
    name: string,
    options: { listId: string; label: string },
  ): Promise<Task> {
    const client = await this.getClient();

    const { id } = await client.addTask({
      content: name,
      ...(options.listId !== 'all' &&
        options.listId !== 'today' && {
          project_id: options.listId,
        }),
      ...(options.listId === 'today' && { due_string: 'today' }),
      ...(options.label && { labels: [options.label] }),
    });

    return {
      id: id.toString(),
      name,
      completed: false,
      ...(options.label && { labels: [options.label] }),
    };
  }

  async deleteTask(taskId: string): Promise<void> {
    const client = await this.getClient();
    const success = await client.deleteTask(taskId);
    if (!success) throw new Error('Failed to delete task');
  }

  async completeTask(taskId: string): Promise<void> {
    const client = await this.getClient();
    const success = await client.closeTask(taskId);
    if (!success) throw new Error('Failed to complete task');
  }

  async undoCompleteTask(taskId: string): Promise<void> {
    const client = await this.getClient();
    const success = await client.reopenTask(taskId);
    if (!success) throw new Error('Failed to undo complete task');
  }

  async fetchTasks(listId: string): Promise<Task[]> {
    const client = await this.getClient();
    const lists = await this.fetchLists();
    const listName = lists.find((list) => list.id === listId)?.name;

    let filter = '';
    if (listId === 'all') {
      filter = 'all';
    } else if (listId === 'today') {
      filter = 'today';
    } else if (listName) {
      filter = `#${listName}`;
    }

    const tasks = await client.getTasks({ filter });
    return tasks.map((task) => ({
      id: task.id,
      name: task.content,
      completed: task.isCompleted,
      labels: task.labels,
      due: task.due?.date ? new Date(task.due.date) : null,
    }));
  }

  async fetchLists(): Promise<{ name: string; id: string }[]> {
    const client = await this.getClient();
    const projects = await client.getProjects();
    return [
      { name: 'Today', id: 'today' },
      ...projects.map((project) => ({
        name: project.name,
        id: project.id,
      })),
      { name: 'All', id: 'all' },
    ];
  }

  async fetchLabels(): Promise<string[]> {
    const client = await this.getClient();
    const labels = await client.getLabels();
    return labels.map((label) => label.name);
  }
}
