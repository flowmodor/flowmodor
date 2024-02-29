import { Metadata } from 'next';
import ForgotPassword from '@/components/Sign/ForgotPassword';

export const metadata: Metadata = {
  title: 'Forgot Password | Flowmodor',
};

export default function ForgotPasswordPage() {
  return <ForgotPassword />;
}
