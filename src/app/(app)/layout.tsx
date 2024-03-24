import { cookies } from 'next/headers';
import Sidebar from '@/components/Layout/Sidebar';
import { getServerClient } from '@/utils/supabase';
import { TourCustomProvider } from './providers';

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
        <Sidebar>{children}</Sidebar>
      </TourCustomProvider>
    );
  }

  return <Sidebar>{children}</Sidebar>;
}
