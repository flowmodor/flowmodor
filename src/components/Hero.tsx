export default function Hero() {
  return (
    <div
      className="pt-24 text-center w-full h-screen bg-[#D6B6FF] flex gap-10
        flex-col items-center text-[#23223C]"
    >
      <div>
        <div className="font-bold text-6xl">Flow and Focus</div>
        <div className="font-bold text-6xl">Beyond Pomodoro</div>
      </div>
      <div className="w-4/5 max-w-xl">
        Flowmodor is an open-source flowmodoro timer web app based on the
        Flowtime Technique, an alternative to the Pomodoro Technique.
      </div>
      <a
        href="#getWaitlistContainer"
        className="font-semibold cursor-pointer rounded-md p-3 text-white bg-[#23223C]"
      >
        Get Started
      </a>
      <img
        src="/phone.png"
        className="absolute -bottom-40 w-64 left-[20%] lg:left-1/4 z-10"
      />
      <img
        src="/laptop.png"
        width={600}
        className="hidden md:block absolute -bottom-40 right-0 lg:right-[10%]"
      />
    </div>
  );
}
