import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { LayoutClient } from '@/components/layout/LayoutClient';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { webAppJsonLd } from '@/lib/jsonLd';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin', 'latin-ext'], // latin-extを追加して拡張文字に対応
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin', 'latin-ext'],
});

// TODO: メタデータを設定する
export const metadata: Metadata = {
  title: '',
  description: '',
  keywords: [],
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
    locale: 'ja_JP',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LayoutClient>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webAppJsonLd()),
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </LayoutClient>
  );
}
