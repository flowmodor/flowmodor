import Progress from './Progress';
import Toolbar from './Toolbar';

export default function TimerTab() {
  return (
    <div className="rounded-lg lg:border-r lg:border-secondary h-[55vh] flex flex-col items-center justify-center  w-[90vw] bg-midground sm:h-[30rem] sm:w-[30rem]">
      <Progress />
      <Toolbar />
    </div>
  );
}
