import { TodoistApi } from '@doist/todoist-api-typescript';
import supabase from './supabase';

export default async function getClient() {
  const { data: integrationsData } = await supabase
    .from('integrations')
    .select('provider, access_token')
    .single();

  if (
    integrationsData?.provider !== 'todoist' ||
    !integrationsData?.access_token
  ) {
    return null;
  }
  return new TodoistApi(integrationsData.access_token);
}
