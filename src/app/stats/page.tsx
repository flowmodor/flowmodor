import { cookies } from 'next/headers';
import Menu from '@/components/Menu';
import Wrapper from '@/components/Stats/Wrapper';
import checkIsPro from '@/utils/checkIsPro';

export default async function Stats() {
  const cookieStore = cookies();
  const isPro = await checkIsPro(cookieStore);

  return (
    <>
      <Menu />
      <Wrapper isPro={isPro} />
    </>
  );
}
