import { Avatar } from '@nextui-org/avatar';
import { Chart, Comment, Gear, House, MoneyBill, User } from '../Icons';
import SidebarTab from './SidebarTab';

export default function Sidebar() {
  return (
    <div className="py-3 flex flex-col items-center fixed left-0 w-14 h-full bg-[#23223C]">
      <div className="flex flex-col gap-3">
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
      <Avatar
        color="secondary"
        showFallback
        fallback={<User />}
        className="mt-auto"
      />
    </div>
  );
}
