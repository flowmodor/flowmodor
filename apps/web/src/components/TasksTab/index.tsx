import Filter from '../TimerTab/Filter';
import ListSelector from '../TimerTab/ListSelector';
import Tasks from './Tasks';
import Toolbar from './Toolbar';

export default function TasksTab() {
  return (
    <div className="flex flex-col h-[55vh] w-[90vw] bg-midground sm:h-[30rem] sm:w-[30rem]">
      <div className="flex gap-3">
        <ListSelector />
        <Filter />
      </div>
      <Tasks />
      <Toolbar />
    </div>
  );
}
