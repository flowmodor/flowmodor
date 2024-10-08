import { TodoistApi } from '@doist/todoist-api-typescript';
import { Supabase } from '@flowmodor/types';

export default async function getClient(supabase: Supabase) {
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
