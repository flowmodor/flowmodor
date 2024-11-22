import { Metadata } from 'next';
import Account from '@/components/Settings/Account';
import Integrations from '@/components/Settings/Integrations';
import Options from '@/components/Settings/Options';
import { createClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
  title: 'Settings | Flowmodor',
};

export default async function Settings() {
  const supabase = await createClient();
  const { data: settingsData } = await supabase
    .from('settings')
    .select('break_ratio')
    .single();
  const breakRatio = settingsData?.break_ratio ?? 5;

  return (
    <div className="my-20 flex flex-col gap-10 w-screen px-10 sm:w-[70vw] md:w-[50vw] lg:w-[40vw]">
      <h1 className="flex items-center gap-3 text-3xl font-semibold">
        Settings
      </h1>
      <Options defaultBreakRatio={breakRatio} />
      <Integrations />
      <Account />
    </div>
  );
}
