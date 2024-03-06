import { cookies } from 'next/headers';
import Image from 'next/image';
import { getServerClient } from '@/utils/supabase';
import { Chart, Comment, Gear, House, MoneyBill } from '../Icons';
import SidebarTab from './SidebarTab';
import UserDropdown from './UserDropdown';

export default async function Sidebar() {
  const supabase = getServerClient(cookies());
  const { data } = await supabase.auth.getUser();

  return (
    <div className="py-3 flex flex-col items-center fixed left-0 w-14 h-full bg-[#23223C]">
      <div className="flex flex-col items-center gap-3">
        <Image
          src="/images/logo.png"
          alt="logo"
          unoptimized
          width={36}
          height={36}
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
      <UserDropdown email={data.user?.email ?? ''} />
    </div>
  );
}
