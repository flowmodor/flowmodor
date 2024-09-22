import { Input } from '@nextui-org/input';
import { Link } from '@nextui-org/link';
import { Metadata } from 'next';
import { signInWithPassword } from '@/actions/auth';
import Or from '@/components/Or';
import OAuthButton from '@/components/Sign/OAuthButton';
import Submit from '@/components/Submit';

export const metadata: Metadata = {
  title: 'Sign In | Flowmodor',
};

export default function SignInPage() {
  return (
    <form
      action={signInWithPassword}
      className="flex flex-col gap-5 text-center w-3/4 max-w-sm"
    >
      <h1 className="mb-5 text-3xl font-semibold">Sign In Now</h1>
      <OAuthButton />
      <Or />
      <Input
        name="email"
        label="Email"
        labelPlacement="outside"
        placeholder="you@example.com"
        variant="bordered"
        type="email"
        radius="sm"
        classNames={{
          input: 'text-[16px]',
          inputWrapper:
            'border-secondary data-[hover=true]:border-secondary data-[focus=true]:!border-primary',
        }}
      />
      <Input
        name="password"
        label="Password"
        labelPlacement="outside"
        placeholder="••••••••"
        variant="bordered"
        type="password"
        radius="sm"
        classNames={{
          input: 'text-[16px]',
          inputWrapper:
            'border-secondary data-[hover=true]:border-secondary data-[focus=true]:!border-primary',
        }}
      />
      <Link
        href="/forgot-password"
        className="mx-auto mt-5 text-sm text-white"
        underline="always"
      >
        Forgot password?
      </Link>
      <Submit>Sign In</Submit>
      <div className="mx-auto text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-sm text-white" underline="always">
          Sign up now
        </Link>
      </div>
    </form>
  );
}
