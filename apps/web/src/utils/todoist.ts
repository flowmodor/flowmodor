import { TodoistApi } from '@doist/todoist-api-typescript';

export default async function getClient(supabase: any) {
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
