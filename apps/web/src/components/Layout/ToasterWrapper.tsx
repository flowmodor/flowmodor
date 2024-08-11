'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { Toaster, toast } from 'sonner';

export default function ToasterWrapper() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const error = searchParams.get('error');
    const success = searchParams.get('success');

    if (error) {
      toast.error(error);
      router.replace(pathname);
    } else if (success) {
      toast.success(success);
      router.replace(pathname);
    }
  }, [pathname, router, searchParams]);

  return (
    <Toaster
      toastOptions={{
        style: {
          background: '#23223C',
          borderColor: '#3F3E55',
          color: '#ffffff',
        },
        actionButtonStyle: {
          background: '#3F3E55',
        },
      }}
    />
  );
}
