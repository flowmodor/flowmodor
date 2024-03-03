import { cookies } from 'next/headers';
import Menu from '@/components/Menu';
import { getServerClient } from '@/utils/supabase';
import { MixpanelProvider, TourCustomProvider } from './providers';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = getServerClient(cookies());
  const { data, error } = await supabase
    .from('profiles')
    .select('is_new')
    .single();

  const isNewUser = !error && data?.is_new;
  if (isNewUser) {
    return (
      <TourCustomProvider>
        <MixpanelProvider>
          <Menu />
          {children}
        </MixpanelProvider>
      </TourCustomProvider>
    );
  }

  return (
    <MixpanelProvider>
      <Menu />
      {children}
    </MixpanelProvider>
  );
}
