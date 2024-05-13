import type { Metadata } from 'next';
import PlausibleProvider from 'next-plausible';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import ToasterWrapper from '@/components/Layout/ToasterWrapper';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://app.flowmodor.com'),
  applicationName: 'Flowmodor',
  title: 'Flowmodor',
  description: 'Flowmodor Web App',
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
      <head>
        <PlausibleProvider domain="app.flowmodor.com" />
      </head>
      <body
        className={`${inter.className} flex min-h-screen justify-center bg-background text-white scrollbar-hide dark`}
      >
        <Providers>{children}</Providers>
        <Suspense>
          <ToasterWrapper />
        </Suspense>
      </body>
    </html>
  );
}
