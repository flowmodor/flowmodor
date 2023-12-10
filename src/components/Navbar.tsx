export default function Navbar() {
  return (
    <div className="sticky top-0 backdrop-blur border-[#ffffff20] border-b flex h-14 items-center pl-5">
      <a
        href="/"
        className="flex cursor-pointer items-center gap-1 text-2xl font-bold hover:brightness-90 transition-all"
      >
        <img src="/logo.png" width={32} />
        Flowmodor
      </a>
    </div>
  );
}
