import { Button } from '@nextui-org/button';
import { Link } from '@nextui-org/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="flex flex-col h-full items-center justify-center gap-10">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-9xl font-bold flex items-center gap-2 text-primary">
          4
          <Image
            src="/images/logo-no-bg.png"
            alt="logo"
            unoptimized
            width={80}
            height={80}
            className="flex-shrink-0 inline-block"
          />
          4
        </h1>
        <h1 className="flex text-gray-300 gap-5 text-sm max-w-sm text-center items-center">
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
