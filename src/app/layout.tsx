import Header from '@/components/layout/Header';
import Providers from '@/components/Providers';
import type { Metadata } from 'next';
import { Bebas_Neue, Geist } from 'next/font/google';
import type { PropsWithChildren } from 'react';
import './globals.css';

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
});

const bebasNeue = Bebas_Neue({
  variable: '--font-bebas-neue',
  subsets: ['latin'],
  weight: '400',
});

export const metadata: Metadata = {
  title: 'BattleSynq',
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${bebasNeue.variable}`}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
