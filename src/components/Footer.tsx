import { X, GitHub } from "./Icons";

export default function Footer() {
  return (
    <div className="w-full border-[#ffffff20] border-t flex justify-center gap-5 items-center h-32">
      <a href="https://twitter.com/flowmodor" className="cursor-pointer">
        <X />
      </a>
      <a
        href="https://github.com/flowmodor/flowmodor"
        className="cursor-pointer"
      >
        <GitHub />
      </a>
      <span className="text-white text-xs">Copyright © 2023 Flowmodor</span>
    </div>
  );
}
