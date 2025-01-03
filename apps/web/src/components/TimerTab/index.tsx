import Progress from './Progress';
import Toolbar from './Toolbar';

export default function TimerTab() {
  return (
    <div className="flex h-full w-[90vw] flex-col items-center justify-center gap-7 rounded-lg  bg-midground py-2 sm:h-[30rem] sm:w-[30rem]">
      <Progress />
      <Toolbar />
    </div>
  );
}
