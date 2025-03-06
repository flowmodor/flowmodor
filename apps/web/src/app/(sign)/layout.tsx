import { Link } from '@heroui/link';
import Image from 'next/image';
import { ReactNode } from 'react';

export default function SignLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen items-center justify-center">
      <Link
        href="https://flowmo.io"
        className="absolute left-5 top-5 flex items-center gap-2 text-white sm:left-10 sm:top-10"
      >
        <Image
          src="/images/logo-no-bg.png"
          alt="logo"
          unoptimized
          width={32}
          height={32}
        />
        <h1 className="hidden text-2xl font-bold sm:block">Flowmo</h1>
      </Link>
      {children}
    </div>
  );
}
