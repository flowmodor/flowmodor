import { cookies } from 'next/headers';
import Image from 'next/image';
import { ReactNode } from 'react';
import { getServerClient } from '@/utils/supabase';
import { Chart, Comments, Gear, House, MoneyBill } from '../Icons';
import SidebarTab from './SidebarTab';
import TrialBanner from './TrialBanner';
import UserDropdown from './UserDropdown';

export default async function Sidebar({ children }: { children: ReactNode }) {
  const supabase = getServerClient(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex h-[100dvh] w-full flex-col items-center scrollbar-hide overflow-y-scroll">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh]">
      <div className="border-r border-r-secondary pt-2 pb-3 flex flex-col items-center ml-0 w-14 h-full bg-midground z-10">
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="logo"
            unoptimized
            width={36}
            height={36}
            priority
          />
          <SidebarTab tabPathname="/" tabName="Home" hotkey="H">
            <House />
          </SidebarTab>
          <SidebarTab tabPathname="/stats" tabName="Stats" hotkey="T">
            <Chart />
          </SidebarTab>
          <SidebarTab tabPathname="/settings" tabName="Settings" hotkey="S">
            <Gear />
          </SidebarTab>
          <SidebarTab tabPathname="/plans" tabName="Plans" hotkey="P">
            <MoneyBill />
          </SidebarTab>
          <SidebarTab tabPathname="/feedback" tabName="Feedback" hotkey="F">
            <Comments />
          </SidebarTab>
        </div>
        <UserDropdown user={user} />
      </div>
      <div className="w-full flex flex-col items-center scrollbar-hide overflow-y-scroll">
        <TrialBanner />
        {children}
      </div>
    </div>
  );
}
