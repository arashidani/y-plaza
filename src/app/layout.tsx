import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

export const dynamic = 'force-static'

// Load fonts at the root so variables are stable for all routes
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'optional',
  preload: false,
  weight: ['400', '500', '600', '700'],
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
  adjustFontFallback: true
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'optional',
  preload: false,
  fallback: ['ui-monospace', 'monospace']
})

export const metadata: Metadata = {
  title: 'Y-Plaza',
  description: 'Root layout wrapper'
}

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col overflow-x-hidden antialiased">
        {children}
      </body>
    </html>
  )
}
