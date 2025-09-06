import { Link } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'
import { CookieConsent } from '@/components/privacy/CookieConsent'
import { CookieResetDev } from '@/components/privacy/CookieResetDev'

export async function Footer() {
  const t = await getTranslations('footer')

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        <CookieConsent />
        <div className="mt-4 flex flex-col items-center justify-between md:mt-0 md:flex-row">
          <p className="text-muted-foreground mb-4 text-sm md:mb-0">
            {t('copyright')}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-primary text-sm transition-colors"
            >
              {t('privacy')}
            </Link>
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-primary text-sm transition-colors"
            >
              {t('terms')}
            </Link>
            <Link
              href="/access"
              className="text-muted-foreground hover:text-primary text-sm transition-colors"
            >
              アクセスマップ
            </Link>
            <CookieResetDev />
          </div>
        </div>
      </div>
    </footer>
  )
}
