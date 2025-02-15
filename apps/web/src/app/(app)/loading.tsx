import { Spinner } from '@heroui/spinner';

export default function Loading() {
  return (
    <div className="flex h-full items-center">
      <Spinner color="primary" />
    </div>
  );
}
