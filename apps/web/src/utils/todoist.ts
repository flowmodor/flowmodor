import { TodoistApi } from '@doist/todoist-api-typescript';
import { SupabaseClient } from './supabase/client';

export default async function getClient(supabase: SupabaseClient) {
  const { data } = await supabase
    .from('integrations')
    .select('todoist')
    .single();

  const todoistToken = data?.todoist;

  if (todoistToken) {
    return new TodoistApi(todoistToken);
  }
  return null;
}
