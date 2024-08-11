import { Link } from '@nextui-org/link';
import Image from 'next/image';
import { ReactNode } from 'react';

export default function SignLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen flex items-center justify-center">
      <Link
        href="https://flowmodor.com"
        className="absolute left-5 top-5 flex items-center gap-2 text-white sm:left-10 sm:top-10"
      >
        <Image
          src="/images/logo.png"
          alt="logo"
          unoptimized
          width={56}
          height={56}
        />
        <h1 className="hidden sm:block text-2xl font-bold">Flowmodor</h1>
      </Link>
      {children}
    </div>
  );
}
