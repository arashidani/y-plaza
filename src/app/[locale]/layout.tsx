import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { LayoutClient } from '@/components/layout/LayoutClient'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { webAppJsonLd } from '@/lib/jsonLd'
import { setRequestLocale } from 'next-intl/server'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { CriticalCSS } from '@/components/layout/CriticalCSS'
import './globals.css'
import { Analytics } from '@vercel/analytics/next'

const geistSans = Geist({
  variable: '--font-geist-sans',
  // latin-extを追加して拡張文字に対応
  subsets: ['latin', 'latin-ext'],
  // フォント読み込み最適化
  display: 'swap', 
  preload: true,
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: '出雲ゆうプラザ 非公式 料金計算ツール｜入場料・回数券・団体・イブニングの合計を自動計算',
  description:
    '出雲ゆうプラザの「季節区分（9〜6月 / 7・8月）」「イブニング（17時以降）」「団体（20名以上）」「回数券（11枚綴）」などをまとめて自動計算できる、非公式の料金シミュレーターです。ロッカー代など注記にも対応。プール・ジム利用の目安料金を手早く把握できます。',
  keywords: [
    '出雲ゆうプラザ',
    'ゆうプラザ',
    '料金',
    '料金表',
    '入場料',
    '回数券',
    '団体料金',
    'イブニング',
    'プール',
    '温水プール',
    '室内プール',
    'レジャープール',
    'トレーニングジム',
    'シルバー割引',
    '障害者割引',
    'ロッカー代',
    '出雲',
    '島根',
    '営業時間',
    '混雑',
    'アクセス',
    '駐車場',
    '計算ツール',
    'シミュレーター',
    'You Plaza Izumo',
    'preço',
    'piscina',
    'ginásio',
    'calculadora',
    'Izumo',
    'Shimane',
  ],
  alternates: {
    languages: {
      'ja': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://y-plaza.vercel.app'}/`,
      'en': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://y-plaza.vercel.app'}/en`,
      'pt': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://y-plaza.vercel.app'}/pt`,
    },
  },
  openGraph: {
    title: '出雲ゆうプラザ 非公式 料金計算ツール',
    description:
      '季節・時間・人数・回数券をまとめて入力。出雲ゆうプラザの料金目安を自動で算出する非公式ツールです。',
    url: process.env.NEXT_PUBLIC_SITE_URL || '',
    siteName: '出雲ゆうプラザ 非公式 料金計算ツール',
    images: [
      {
        // OG画像（推奨: 1200x630、PNG/JPG）
        url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/og.png`,
        width: 1200,
        height: 630,
        alt: '出雲ゆうプラザ 非公式 料金計算ツール',
      },
    ],
    type: 'website',
    locale: 'ja_JP',
  },
  robots: {
    index: true,
    follow: true,
  },
  // ブランド・法務の観点から、非公式である旨をmetaにも明示
  other: {
    'note:unofficial': 'This site is an unofficial calculator for Izumo Yuu Plaza.',
  },
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  // SSG対応
  setRequestLocale(locale)

  // 言語ファイルの読み込み
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* リソースヒント - 重要なオリジンのプリコネクト */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="//vercel.live" />
        
        {/* 重要リソースのプリロード */}
        <link rel="preload" as="style" href="/favicon.svg" />
        
        {/* SVG を使う */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        {/* 互換性のためPNGも指定（ブラウザにより優先されることがある） */}
        <link rel="icon" href="/favicon.png" sizes="32x32" />
        {/* 古いブラウザやWindows用の.ico */}
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0077b6" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webAppJsonLd()),
          }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <LayoutClient>
              <Header />
              <main className="flex-1 w-full overflow-x-hidden">{children}</main>
              <Footer />
            </LayoutClient>
          </NextIntlClientProvider>
        </ThemeProvider>
        <CriticalCSS />
        <Analytics />
      </body>
    </html>
  )
}
