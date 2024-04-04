import { cookies } from 'next/headers';
import Image from 'next/image';
import { ReactNode } from 'react';
import { getServerClient } from '@/utils/supabase';
import { Chart, Comment, Gear, House, MoneyBill } from '../Icons';
import SidebarTab from './SidebarTab';
import UserDropdown from './UserDropdown';

export default async function Sidebar({ children }: { children: ReactNode }) {
  const supabase = getServerClient(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex h-screen">
      <div className="py-3 flex flex-col items-center ml-0 w-14 h-full bg-[#23223C]">
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="logo"
            unoptimized
            width={36}
            height={36}
            priority
          />
          <SidebarTab tabPathname="/" tabName="Home">
            <House />
          </SidebarTab>
          <SidebarTab tabPathname="/stats" tabName="Stats">
            <Chart />
          </SidebarTab>
          <SidebarTab tabPathname="/settings" tabName="Settings">
            <Gear />
          </SidebarTab>
          <SidebarTab tabPathname="/plans" tabName="Plans">
            <MoneyBill />
          </SidebarTab>
          <SidebarTab tabPathname="/feedback" tabName="Feedback">
            <Comment />
          </SidebarTab>
        </div>
        <UserDropdown user={user} />
      </div>
      <div className="w-full flex justify-center scrollbar-hide overflow-y-scroll">
        {children}
      </div>
    </div>
  );
}
