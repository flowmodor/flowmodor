import Image from 'next/image';
import { ReactNode } from 'react';
import { createClient } from '@/utils/supabase/server';
import { Chart, Gear, House } from '../Icons';
import SidebarTab from './SidebarTab';
import UserDropdown from './UserDropdown';

export default async function Sidebar({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col-reverse sm:flex-row h-[100dvh]">
      <div className="border-t border-t-secondary sm:border-t-0 sm:border-r sm:border-r-secondary py-3 flex flex-row justify-center sm:flex-col items-center ml-0 w-full sm:w-14 sm:h-full bg-midground z-10">
        <div className="flex flex-row sm:flex-col justify-center items-center gap-3">
          <Image
            src="/images/logo-no-bg.png"
            alt="logo"
            unoptimized
            width={28}
            height={28}
            priority
            className="hidden sm:block"
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
        </div>
        <div className="absolute top-5 right-5 sm:static mt-auto flex flex-row sm:flex-col items-center gap-5">
          <UserDropdown user={user} />
        </div>
      </div>
      <div className="h-full sm:w-full flex flex-col items-center scrollbar-hide overflow-y-scroll">
        {children}
      </div>
    </div>
  );
}
