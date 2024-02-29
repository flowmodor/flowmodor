import { Metadata } from 'next';
import SignIn from '@/components/Sign/SignIn';

export const metadata: Metadata = {
  title: 'Sign In | Flowmodor',
};

export default function SignInPage() {
  return <SignIn />;
}
