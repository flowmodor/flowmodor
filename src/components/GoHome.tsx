/* eslint-disable react/require-default-props */
import { Link } from '@nextui-org/link';
import { ArrowLeft } from './Icons';

export default function GoHome({ href = '/' }: { href?: string }) {
  return (
    <Link href={href}>
      <ArrowLeft />
    </Link>
  );
}
