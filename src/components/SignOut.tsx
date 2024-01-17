import { Button } from '@nextui-org/button';
import useSignOut from '@/hooks/useSignOut';
import { useRouter } from 'next/navigation';
import { Exit } from './Icons';

export default function SignOut() {
  const { signOut } = useSignOut();
  const router = useRouter();

  return (
    <Button
      color="secondary"
      isIconOnly
      className="absolute right-5 top-5 fill-white"
      onPress={async () => {
        await signOut();
        router.push('/signin');
      }}
    >
      <Exit />
    </Button>
  );
}
