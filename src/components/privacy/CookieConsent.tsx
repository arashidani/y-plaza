'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const STORAGE_KEY = 'cookieConsent.v1'
const LEGACY_KEY = 'cookie-consent'

type Consent = 'accepted' | 'denied'

export function CookieConsent() {
  const t = useTranslations('footer')
  const [show, setShow] = useState(false)

  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY)
      setShow(v !== 'accepted' && v !== 'denied' && v !== 'true' && v !== 'false')
    } catch {
      setShow(true)
    }
  }, [])

  const setConsent = useCallback(async (value: Consent) => {
    try {
      // Client-side persistence (both keys for compatibility)
      localStorage.setItem(STORAGE_KEY, value)
      localStorage.setItem(LEGACY_KEY, value === 'accepted' ? 'true' : 'false')

      // Server-side httpOnly cookie
      const endpoint = value === 'accepted' ? '/api/consent' : '/api/consent/reject'
      await fetch(endpoint, { method: 'POST', credentials: 'same-origin' })
    } catch {
      // ignore write failures
    }
    setShow(false)
  }, [])

  if (!show) return null

  return (
    <div className="fixed bottom-4 left-1/2 z-[10002] w-full max-w-md -translate-x-1/2 px-4 pb-[env(safe-area-inset-bottom)]">
      <Card className="shadow-lg">
        <CardContent className="flex flex-col gap-3 p-4">
          <p className="text-sm">
            {t.rich('cookie.message', {
              link: (chunks) => (
                <Link
                  href="/privacy"
                  className="text-primary underline underline-offset-2 hover:text-primary/80"
                >
                  {chunks}
                </Link>
              )
            })}
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setConsent('denied')}>
              {t('cookie.deny')}
            </Button>
            <Button size="sm" onClick={() => setConsent('accepted')}>
              {t('cookie.accept')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
