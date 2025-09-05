'use client'

import { useCallback } from 'react'
import { useTranslations } from 'next-intl'

const STORAGE_KEY = 'cookieConsent.v1'
const LEGACY_KEY = 'cookie-consent'

export function CookieResetDev() {
  // Always call hooks first
  const t = useTranslations('footer')
  const onReset = useCallback(async () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(LEGACY_KEY)
      await fetch('/api/consent/reject', {
        method: 'POST',
        credentials: 'same-origin'
      })
    } catch (e) {
      console.error('cookie reset failed', e)
    } finally {
      location.reload()
    }
  }, [])

  const isDev = process.env.NODE_ENV === 'development'
  if (!isDev) return null

  return (
    <button
      type="button"
      onClick={onReset}
      className="text-muted-foreground hover:text-primary text-xs underline underline-offset-2"
      title={t('cookie.reset')}
    >
      {t('cookie.reset')}
    </button>
  )
}
