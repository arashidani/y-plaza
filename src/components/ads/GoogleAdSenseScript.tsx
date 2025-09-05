import Script from "next/script"

export function GoogleAdSenseScript() {
  const client = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT
  if (!client) return null
  return (
    <Script
      id="adsbygoogle-init"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      async
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  )
}

