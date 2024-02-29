import { Metadata } from 'next';
import SignUp from '@/components/Sign/SignUp';

export const metadata: Metadata = {
  title: 'Sign Up | Flowmodor',
};

export default function SignUpPage() {
  return <SignUp />;
}
