import { Link } from '@heroui/link';
import { Metadata } from 'next';
import { signUp } from '@/actions/auth';
import SignUpForm from '@/components/Sign/SignUpForm';

export const metadata: Metadata = {
  title: 'Sign Up | Flowmo',
};

export default function SignUpPage() {
  return (
    <form
      action={signUp}
      className="flex w-3/4 max-w-sm flex-col gap-5 text-center"
    >
      <h1 className="text-3xl font-semibold">Get started</h1>
      <SignUpForm />
      <div className="mx-auto text-sm">
        Have an account?{' '}
        <Link href="/signin" className="text-sm text-white" underline="always">
          Sign in now
        </Link>
      </div>
    </form>
  );
}
