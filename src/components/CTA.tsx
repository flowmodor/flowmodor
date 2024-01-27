export default function CTA() {
  return (
    <div
      id="waitlist"
      className="h-screen -mb-32 justify-center mx-4 flex flex-col lg:w-1/2 items-center text-center"
    >
      <div className="text-4xl font-semibold">Get into flow state with us.</div>
      <div className="mt-2 mb-10 w-2/3 text-zinc-300">
        Boost your productivity with Flowmodor.
      </div>
      <a
        href="https://app.flowmodor.com/signin"
        className="font-semibold cursor-pointer rounded-md p-3 text-[#131221] bg-[#DBBFFF] hover:brightness-105 transition-all duration-300"
      >
        Get started
      </a>
    </div>
  );
}
