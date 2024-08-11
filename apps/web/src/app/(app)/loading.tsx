import { Spinner } from '@nextui-org/spinner';

export default function Loading() {
  return (
    <div className="flex h-full items-center">
      <Spinner color="primary" />
    </div>
  );
}
