import { Button } from '@nextui-org/button';
import { Link } from '@nextui-org/link';
import { Fira_Code } from 'next/font/google';
import Image from 'next/image';

const firaCode = Fira_Code({ subsets: ['latin'] });

export default function NotFound() {
  return (
    <div className="flex flex-col h-full items-center justify-center gap-10">
      <div className="flex flex-col items-center gap-2">
        <h1 className={`${firaCode.className} text-9xl font-bold`}>404</h1>
        <h1
          className={`${firaCode.className} text-7xl font-bold flex gap-5 items-center`}
        >
          Not
          <span className="inline-flex items-center gap-1">
            <Image
              src="/images/not-found-logo.png"
              alt="logo"
              unoptimized
              width={80}
              height={80}
              className="flex-shrink-0"
            />
            ound
          </span>
        </h1>
      </div>
      <Button as={Link} href="/" radius="sm" color="secondary">
        Go back to homepage
      </Button>
    </div>
  );
}
