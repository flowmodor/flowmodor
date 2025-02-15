import Filter from '../TimerTab/Filter';
import ListSelector from './ListSelector';
import SourceSelector from './SourceSelector';
import Tasks from './Tasks';
import Toolbar from './Toolbar';

export default function TasksTab() {
  return (
    <div className="flex h-full w-[90vw] flex-col gap-2 overflow-hidden rounded-lg bg-midground p-2 sm:h-[30rem] sm:w-[30rem]">
      <div className="flex gap-3">
        <SourceSelector />
        <ListSelector />
        <Filter />
      </div>
      <Tasks />
      <Toolbar />
    </div>
  );
}
