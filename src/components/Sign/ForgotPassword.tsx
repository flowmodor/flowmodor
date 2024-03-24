import { Input } from '@nextui-org/input';
import { Link } from '@nextui-org/link';
import { sendPasswordReset } from '@/actions/auth';
import Submit from '../Submit';

export default function ForgotPassword() {
  return (
    <form
      action={sendPasswordReset}
      className="flex flex-col gap-5 text-center sm:w-96"
    >
      <h1 className="text-3xl font-semibold">Forgot your password?</h1>
      <div className="mx-auto w-[70vw] text-sm sm:w-auto">
        To reset your password, please enter the email address of your Flowmodor
        account.
      </div>
      <Input
        name="email"
        label="Email"
        labelPlacement="outside"
        placeholder="you@example.com"
        variant="bordered"
        type="email"
        radius="sm"
        classNames={{
          base: 'my-5',
          input: 'text-[16px]',
          inputWrapper:
            'border-secondary data-[hover=true]:border-secondary data-[focus=true]:!border-primary',
        }}
      />
      <Submit>Reset my password</Submit>
      <Link
        href="/signin"
        className="mx-auto text-sm text-white"
        underline="always"
      >
        Go to signin
      </Link>
    </form>
  );
}
