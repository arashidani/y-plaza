'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

type AdBannerProps = {
  adSlot: string
  className?: string
  style?: React.CSSProperties
  adFormat?: string
  fullWidthResponsive?: boolean | 'true' | 'false'
}

export function AdBanner({
  adSlot,
  className,
  style,
  adFormat = 'auto',
  fullWidthResponsive = true
}: AdBannerProps) {
  const adClient = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!adClient || !adSlot) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      console.error('adsbygoogle push error', e)
    }
  }, [adClient, adSlot])

  if (!adClient || !adSlot) {
    // In development or when not configured, render nothing
    return null
  }

  return (
    <ins
      className={['adsbygoogle', className].filter(Boolean).join(' ')}
      style={{ display: 'block', ...style }}
      data-ad-client={adClient}
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive={
        typeof fullWidthResponsive === 'boolean'
          ? String(fullWidthResponsive)
          : fullWidthResponsive
      }
    />
  )
}
