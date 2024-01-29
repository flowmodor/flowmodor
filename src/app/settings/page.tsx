import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { Link } from '@nextui-org/link';
import GoHome from '@/components/GoHome';
import Menu from '@/components/Menu';
import Options from '@/components/Settings/Options';

export default async function Settings() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    },
  );

  const { data } = await supabase
    .from('plans')
    .select('end_time, status')
    .single();

  const { status, end_time: endTime } = data ?? {};
  const isPro = status === 'ACTIVE' || new Date(endTime) > new Date();

  const { data: settingsData } = await supabase
    .from('settings')
    .select('break_ratio')
    .single();
  const breakRatio = settingsData?.break_ratio ?? 5;

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
            to set custom break ratio.
          </div>
        ) : null}
        <Options isPro={isPro} defaultBreakRatio={breakRatio} />
      </div>
    </>
  );
}
