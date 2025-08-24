import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { getCurrentLocale } from '@/lib/i18n';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin', 'latin-ext'], // latin-extを追加して拡張文字に対応
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin', 'latin-ext'],
});

export const metadata: Metadata = {
  // TODO: メタデータを設定する
  // metadataBase: new URL(''),
  title: '',
  description: '',
  openGraph: {
    title: '',
    description: '',
    url: '',
    siteName: '',
    images: [
      {
        url: '',
        width: 800,
        height: 600,
      },
    ],
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = getCurrentLocale();

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
