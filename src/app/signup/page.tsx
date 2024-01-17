import { Link } from '@nextui-org/react';

export default function SignUp() {
  return (
    <div className="w-96 gap-5 rounded-lg p-10 text-center">
      Flowmodor is currently in private beta. Join{' '}
      <Link href="https://flowmodor.com/#getWaitlistContainer">waitlist</Link>{' '}
      to get early access.
    </div>
  );
}
