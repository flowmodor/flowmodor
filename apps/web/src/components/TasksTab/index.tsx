import Filter from '../TimerTab/Filter';
import ListSelector from './ListSelector';
import SourceSelector from './SourceSelector';
import Tasks from './Tasks';
import Toolbar from './Toolbar';

export default function TasksTab() {
  return (
    <div className="p-2 rounded-lg flex gap-2 flex-col h-full w-[90vw] bg-midground sm:h-[30rem] sm:w-[30rem]">
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
