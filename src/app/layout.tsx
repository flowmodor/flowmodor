import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://app.flowmodor.com'),
  title: 'Flowmodor',
  openGraph: {
    type: 'website',
    url: 'https://app.flowmodor.com',
    title: 'Flowmodor',
    description: 'Flowmodor Web App',
    images: [{ url: 'https://flowmodor.com/og.png' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} flex min-h-screen justify-center bg-background text-white scrollbar-hide dark`}
      >
        <Providers>{children}</Providers>
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
      </body>
    </html>
  );
}
