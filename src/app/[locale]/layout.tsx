import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { StreamingWrapper } from '@/components/streaming/StreamingWrapper'
import { getCachedJsonLd } from '@/lib/cached-jsonld'
import { setRequestLocale } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'
import { getCachedMessages, validateLocale } from '@/lib/i18n-cache'
import { generateLocaleParams } from '@/lib/static-params'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { CriticalCSS } from '@/components/layout/CriticalCSS'
import './globals.css'
import { LazyAnalytics } from '@/components/analytics/LazyAnalytics'
import { GoogleAdSenseScript } from '@/components/ads/GoogleAdSenseScript'

// フォント最適化: 必要最小限のサブセットのみ読み込み
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  // モバイル最適化: blockからoptionalに変更
  display: 'optional',
  preload: true,
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
  adjustFontFallback: true
})

// モノスペースフォントは遅延読み込み
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'optional',
  preload: false,
  fallback: ['ui-monospace', 'monospace']
})

// Node.js Runtime (generateStaticParams使用のため)
export const runtime = 'nodejs'
// 静的生成を強制してTTFBを改善
export const dynamic = 'force-static'
// 24時間キャッシュでパフォーマンス向上
export const revalidate = 86400
// 静的パラメータの生成
export async function generateStaticParams() {
  return generateLocaleParams()
}

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://azarashi.work'
  ),
  title:
    '出雲ゆうプラザ 非公式 料金計算ツール｜入場料・回数券・団体・イブニングの合計を自動計算',
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
    'Shimane'
  ],
  alternates: {
    languages: {
      ja: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://azarashi.work'}/`,
      en: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://azarashi.work'}/en`,
      pt: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://azarashi.work'}/pt`
    }
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
        alt: '出雲ゆうプラザ 非公式 料金計算ツール'
      }
    ],
    type: 'website',
    locale: 'ja_JP'
  },
  robots: {
    index: true,
    follow: true
  },
  // ブランド・法務の観点から、非公式である旨をmetaにも明示
  other: {
    'note:unofficial':
      'This site is an unofficial calculator for Izumo Yuu Plaza.'
  }
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  // ロケール検証とキャッシュ
  const validatedLocale = validateLocale(locale)

  // SSG対応
  setRequestLocale(validatedLocale)

  // キャッシュされた言語ファイルの読み込み
  const messages = await getCachedMessages(validatedLocale)

  return (
    <html
      lang={validatedLocale}
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* 重要リソースの優先プリロード */}
        <link
          rel="preload"
          href="/flags/jp.svg"
          as="image"
          type="image/svg+xml"
        />

        {/* DNS プリフェッチ（低優先度） */}
        <link rel="dns-prefetch" href="//vercel.live" />

        <meta name="theme-color" content="#0077b6" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getCachedJsonLd())
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col overflow-x-hidden antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <StreamingWrapper
              fallback={<div className="h-16 animate-pulse bg-gray-100"></div>}
            >
              <Header />
              <main className="w-full flex-1 overflow-x-hidden px-4 py-6 md:px-6">
                {children}
              </main>
            </StreamingWrapper>
            <Footer />
          </NextIntlClientProvider>
        </ThemeProvider>
        <CriticalCSS />
        <LazyAnalytics />
        <GoogleAdSenseScript />
      </body>
    </html>
  )
}
