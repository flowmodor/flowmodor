import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-10">
      <div className="flex flex-col items-center gap-2">
        <h1 className="flex items-center gap-2 text-9xl font-bold text-primary">
          4
          <Image
            src="/images/logo-no-bg.png"
            alt="logo"
            unoptimized
            width={80}
            height={80}
            className="inline-block flex-shrink-0"
          />
          4
        </h1>
        <h1 className="flex max-w-sm items-center gap-5 text-center text-sm text-gray-300">
          The page you are looking for doesn&apos;t exist. Please go back to the
          home page.
        </h1>
      </div>
      <Button as={Link} href="/" radius="sm" color="primary">
        Home
      </Button>
    </div>
  );
}
