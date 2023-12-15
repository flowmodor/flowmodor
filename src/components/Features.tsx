export default function Features() {
  return (
    <div id="features" className="flex flex-col items-center w-full px-3">
      <div className="mt-48 flex flex-col lg:flex-row items-center gap-10">
        <img src="/timer.png" className="w-full max-w-xl" />
        <div className="max-w-[24rem] flex flex-col gap-5">
          <h1 className="text-3xl font-bold">Flowmodoro Timer</h1>
          Automates time tracking by counting up during focus sessions and
          switching to a countdown for breaks, based on your work duration.
        </div>
      </div>
      <div className="mt-32 flex flex-col lg:flex-row items-center gap-10">
        <img src="/taskList.png" className="w-full max-w-[15rem]" />
        <div className="max-w-[24rem] flex flex-col gap-5 lg:order-first">
          <h1 className="text-3xl font-bold">Task List</h1>
          Easily select and track tasks for each session, aiding in organization
          and progress monitoring.
        </div>
      </div>
      <div className="mt-32 flex flex-col lg:flex-row items-center gap-10">
        <img src="/report.png" className="w-full max-w-xl" />
        <div className="max-w-[24rem]  flex flex-col gap-5">
          <h1 className="text-3xl font-bold">Focus Report</h1>
          Tracks and summarizes work and break patterns for enhanced
          productivity insights.
        </div>
      </div>
    </div>
  );
}
