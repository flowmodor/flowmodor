import { cookies } from 'next/headers';
import Sidebar from '@/components/Layout/Sidebar';
import { getServerClient } from '@/utils/supabase';
import { HomeProvider, TourCustomProvider } from './providers';

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
        <HomeProvider>
          <Sidebar>{children}</Sidebar>
        </HomeProvider>
      </TourCustomProvider>
    );
  }

  return (
    <Sidebar>
      <HomeProvider>{children}</HomeProvider>
    </Sidebar>
  );
}
