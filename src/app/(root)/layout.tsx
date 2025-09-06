export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  // 最小のHTMLラッパー（即時リダイレクト用）
  return (
    <html lang="ja" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
