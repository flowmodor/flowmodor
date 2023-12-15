export default function Hero() {
  return (
    <div
      className="flex flex-col xl:flex-row w-full h-screen bg-[#DBBFFF]
        items-center justify-center gap-10 xl:gap-0"
    >
      <div className="flex gap-10 flex-col items-center xl:items-start text-[#23223C]">
        <div className="text-center xl:text-start font-bold text-6xl">
          <div>Flow and Focus</div>
          <div>Beyond Pomodoro</div>
        </div>
        <div className="w-4/5 max-w-xl text-center xl:text-start">
          Flowmodor is an open-source flowmodoro timer web app based on the
          Flowtime Technique, an alternative to the Pomodoro Technique.
        </div>
        <div className="flex gap-5">
          <a
            href="#getWaitlistContainer"
            className="font-semibold cursor-pointer rounded-md p-3 text-white bg-[#23223C]"
          >
            Get Started
          </a>
          <a
            href="https://github.com/flowmodor/flowmodor"
            className="font-semibold cursor-pointer rounded-md p-3
              border-2 border-[#23223C] text-[#23223C]"
          >
            Star on GitHub
          </a>
        </div>
      </div>
      <img
        src="/mock.png"
        className="hidden xl:block w-[40rem] flex-shrink-0"
      />
    </div>
  );
}
