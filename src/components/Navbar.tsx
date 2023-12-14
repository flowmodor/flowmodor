export default function Navbar() {
  return (
    <nav className="mb-[-56px] backdrop-blur border-[#ffffff20] border-b flex h-14 items-center pl-5">
      <a
        href="/"
        className="flex cursor-pointer items-center gap-2 text-2xl font-bold hover:brightness-90 transition-all"
      >
        <img src="/logo.png" width={32} className="rounded-md" />
        <div className="text-[#23223C]">Flowmodor</div>
      </a>
    </nav>
  );
}
