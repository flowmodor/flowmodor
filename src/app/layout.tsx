import './globals.css';
import 'react-toastify/dist/ReactToastify.min.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Flowmodor',
  openGraph: {
    type: 'website',
    url: 'https://app.flowmodor.com',
    title: 'Flowmodor',
    description: 'Flowmodor Web App',
    images: [{ url: 'https://flowmodor.com/og.png' }],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} flex h-screen items-center justify-center bg-background text-white dark`}
      >
        <Providers>{children}</Providers>
        <ToastContainer theme="dark" />
      </body>
    </html>
  );
}
