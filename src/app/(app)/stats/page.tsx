import { Metadata } from 'next';
import { cookies } from 'next/headers';
import Wrapper from '@/components/Stats/Wrapper';
import checkIsPro from '@/utils/checkIsPro';

export const metadata: Metadata = {
  title: 'Stats | Flowmodor',
};

export default async function Stats() {
  const cookieStore = cookies();
  const isPro = await checkIsPro(cookieStore);

  return <Wrapper isPro={isPro} />;
}
