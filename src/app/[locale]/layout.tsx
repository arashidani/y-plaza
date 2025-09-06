import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { StreamingWrapper } from '@/components/streaming/StreamingWrapper'
import { setRequestLocale } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'
import { getCachedMessages, validateLocale } from '@/lib/i18n-cache'
import { generateLocaleParams } from '@/lib/static-params'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { CriticalCSS } from '@/components/layout/CriticalCSS'
import './globals.css'
import { LazyAnalytics } from '@/components/analytics/LazyAnalytics'

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

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.azarashi.work'
  const langs: Record<string, string> = {
    ja: `${base}/ja`,
    en: `${base}/en`,
    pt: `${base}/pt`
  }
  const ogLocale =
    locale === 'en' ? 'en_US' : locale === 'pt' ? 'pt_BR' : 'ja_JP'

  return {
    metadataBase: new URL(base),
    title:
      '出雲ゆうプラザ 非公式 料金計算ツール｜入場料・回数券・団体・イブニングの合計を自動計算',
    description:
      '出雲ゆうプラザの「季節区分（9〜6月 / 7・8月）」「イブニング（17時以降）」「回数券（11枚綴）」などをまとめて自動計算できる、非公式の料金シミュレーターです。プール・ジム利用の目安料金を手早く把握できます。',
    keywords: [
      '出雲',
      '遊プラザ',
      'ゆうぷら',
      '出雲ゆうプラザ',
      'ゆうプラザ',
      '料金',
      '料金表',
      '入場料',
      '回数券',
      '団体料金',
      'イブニング',
      'プール',
      '温泉',
      'ジム',
      'アクアビクス',
      '子供',
      '温水プール',
      '室内プール',
      'レジャープール',
      'トレーニングジム',
      'シルバー割引',
      '障害者割引',
      'ロッカー代',
      '出雲',
      '島根',
      '計算',
      '計算ツール',
      'シミュレーター',
      'ジョイメイト',
      'リロクラブ',
      // English keywords
      'Izumo',
      'Yu Plaza',
      'You Plaza',
      'You Plaza Izumo',
      'Izumo You Plaza',
      'price',
      'pricing',
      'fee',
      'admission fee',
      'entrance fee',
      'ticket',
      'group price',
      'evening',
      'pool',
      'hot spring',
      'gym',
      'aqua aerobics',
      'children',
      'kids',
      'heated pool',
      'indoor pool',
      'leisure pool',
      'training gym',
      'senior discount',
      'disability discount',
      'locker fee',
      'Shimane',
      'calculate',
      'calculator',
      'calculation tool',
      'simulator',
      'Joymate',
      'Rilo Club',
      // Portuguese keywords
      'preço',
      'preços',
      'taxa',
      'taxa de entrada',
      'ingresso',
      'bilhete',
      'preço de grupo',
      'noite',
      'piscina',
      'termas',
      'academia',
      'ginásio',
      'aqua aeróbica',
      'crianças',
      'piscina aquecida',
      'piscina coberta',
      'piscina de lazer',
      'academia de treinamento',
      'desconto para idosos',
      'desconto para deficientes',
      'taxa do armário',
      'calcular',
      'calculadora',
      'ferramenta de cálculo',
      'simulador'
    ],
    alternates: {
      languages: { ...langs, 'x-default': base }
    },
    openGraph: {
      title: '出雲ゆうプラザ 非公式 料金計算ツール',
      description:
        '季節・時間・人数・回数券をまとめて入力。出雲ゆうプラザの料金目安を自動で算出する非公式ツールです。',
      url: base,
      siteName: '出雲ゆうプラザ 非公式 料金計算ツール',
      images: [
        {
          url: `${base}/og.png`,
          width: 1200,
          height: 630,
          alt: '出雲ゆうプラザ 非公式 料金計算ツール'
        }
      ],
      type: 'website',
      locale: ogLocale
    },
    robots: { index: true, follow: true },
    other: {
      'note:unofficial':
        'This site is an unofficial calculator for Izumo Yuu Plaza.'
    }
  }
}

// フォント最適化: 必要最小限のサブセットのみ読み込み
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'optional',
  preload: false,
  weight: ['400', '500', '600', '700'],
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

export default async function LocaleLayout({
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
      </body>
    </html>
  )
}
