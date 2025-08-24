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
import './globals.css'


const geistSans = Geist({
  variable: '--font-geist-sans',
  // latin-extを追加して拡張文字に対応
  subsets: ['latin', 'latin-ext'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin', 'latin-ext'],
})

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
}

export default async function RootLayout({
  children,
  params
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
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webAppJsonLd()),
          }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <LayoutClient>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </LayoutClient>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
