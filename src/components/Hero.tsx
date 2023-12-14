export default function Hero() {
  return (
    <div className="mt-20 text-center w-full flex gap-10 flex-col items-center">
      <div>
        <div className="font-bold text-6xl">Flow and Focus</div>
        <div className="font-bold text-6xl text-[#D6B6FF]">Beyond Pomodoro</div>
      </div>
      <div className="w-4/5 max-w-xl text-[#dddddd]">
        Flowmodor is an open-source flowmodoro timer web app based on the
        Flowtime Technique, an alternative to the Pomodoro Technique.
      </div>
      <a
        href="#getWaitlistContainer"
        className="font-semibold cursor-pointer rounded-md p-3 text-[#23223C] bg-[#D6B6FF]"
      >
        Get Started
      </a>
    </div>
  );
}
