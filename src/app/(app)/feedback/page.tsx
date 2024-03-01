import { Metadata } from 'next';
import Feedback from '@/components/Feedback';

export const metadata: Metadata = {
  title: 'Feedback | Flowmodor',
};

export default function FeedbackPage() {
  return <Feedback />;
}
