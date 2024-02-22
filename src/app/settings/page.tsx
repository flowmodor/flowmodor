import { Link } from '@nextui-org/link';
import { cookies } from 'next/headers';
import GoHome from '@/components/GoHome';
import Menu from '@/components/Menu';
import Integrations from '@/components/Settings/Integrations';
import Options from '@/components/Settings/Options';
import checkIsPro from '@/utils/checkIsPro';
import { getServerClient } from '@/utils/supabase';

export default async function Settings() {
  const cookieStore = cookies();
  const isPro = await checkIsPro(cookieStore);
  const supabase = getServerClient(cookieStore);
  const { data: settingsData } = await supabase
    .from('settings')
    .select('break_ratio')
    .single();
  const breakRatio = settingsData?.break_ratio ?? 5;

  const { data: integrationsData } = await supabase
    .from('integrations')
    .select('provider')
    .single();

  return (
    <>
      <Menu />
      <div className="mt-20 w-screen px-10 sm:w-[70vw] md:w-[50vw] lg:w-[40vw]">
        <h1 className="mb-10 flex items-center gap-3 text-3xl font-semibold">
          <GoHome />
          Settings
        </h1>
        {!isPro ? (
          <div className="mb-10">
            <Link underline="always" href="/plans">
              Upgrade to Pro
            </Link>{' '}
            to access advanced settings.
          </div>
        ) : null}
        <Options isPro={isPro} defaultBreakRatio={breakRatio} />
        <Integrations provider={integrationsData?.provider} />
      </div>
    </>
  );
}
