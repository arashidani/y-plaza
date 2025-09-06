import { getCachedJsonLd } from '@/lib/cached-jsonld'

export default function LocaleHead() {
  return (
    <>
      {/* 重要リソースの優先プリロード */}
      <link rel="preload" href="/flags/jp.svg" as="image" type="image/svg+xml" />

      {/* DNSプリフェッチ（開発時のみ） */}
      {process.env.NODE_ENV !== 'production' && (
        <link rel="dns-prefetch" href="//vercel.live" />
      )}

      <meta name="theme-color" content="#9ca3af" />
      {process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT && (
        <meta
          name="google-adsense-account"
          content={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT}
        />
      )}
      <script
        type="application/ld+json"
        id="app-jsonld"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getCachedJsonLd()) }}
      />
    </>
  )
}

