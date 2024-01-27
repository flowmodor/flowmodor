import { Link } from '@nextui-org/link';
import { ArrowLeft } from './Icons';

export default function GoHome({ href }: { href?: string }) {
  return (
    <Link href={href}>
      <ArrowLeft />
    </Link>
  );
}

GoHome.defaultProps = {
  href: '/',
};
