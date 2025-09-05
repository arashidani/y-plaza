'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { type Locale } from '@/constants/locales'
import { locales, localeNames, localeFlagCodes } from '@/lib/i18n'
import { Globe } from 'lucide-react'
import { Flag } from '@/components/ui/flag'
import { Link, useRouter, usePathname } from '@/i18n/routing'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { MobileMenu } from '@/components/layout/MobileMenu'

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const currentLocale = params.locale as Locale
  const t = useTranslations('header')
  const tFooter = useTranslations('footer')

  const handleLanguageChange = (value: Locale) => {
    router.push(pathname, { locale: value })
  }

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-3">
          <MobileMenu />
          <Link
            href="/"
            className="text-primary hover:text-primary/80 flex-shrink-0 text-center leading-tight font-bold transition-colors"
          >
            <div className="text-base sm:text-xl">
              {t('title').split(' ').length > 1 ? (
                <>
                  {t('title')
                    .split(' ')
                    .slice(0, Math.ceil(t('title').split(' ').length / 2))
                    .join(' ')}
                  <br />
                  {t('title')
                    .split(' ')
                    .slice(Math.ceil(t('title').split(' ').length / 2))
                    .join(' ')}
                </>
              ) : (
                <>
                  {t('title').slice(0, Math.ceil(t('title').length / 2))}
                  <br />
                  {t('title').slice(Math.ceil(t('title').length / 2))}
                </>
              )}
            </div>
          </Link>
        </div>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden md:flex items-center gap-6">
          <Link
            href="/privacy"
            className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
          >
            {tFooter('privacy')}
          </Link>
          <Link
            href="/terms"
            className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
          >
            {tFooter('terms')}
          </Link>
        </nav>

        <div className="flex flex-shrink-0 items-center space-x-2 sm:space-x-4">
          <ThemeToggle />
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Globe className="text-muted-foreground hidden h-4 w-4 sm:inline" />
            <div className="relative">
              <Select
                value={currentLocale}
                onValueChange={handleLanguageChange}
              >
                <SelectTrigger
                  className="relative w-20 sm:w-36"
                  aria-label={t('languageSelector')}
                  aria-describedby="current-language"
                >
                  <SelectValue placeholder={t('language')}>
                    <span
                      id="current-language"
                      className="flex items-center gap-1 sm:gap-2"
                    >
                      <Flag
                        countryCode={localeFlagCodes[currentLocale]}
                        style={{
                          width: '1rem',
                          height: '0.75rem'
                        }}
                        alt=""
                        role="presentation"
                      />
                      <span className="hidden sm:inline">
                        {localeNames[currentLocale]}
                      </span>
                      <span className="sr-only">
                        {t('language')}: {localeNames[currentLocale]}
                      </span>
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent
                  side="bottom"
                  align="end"
                  className="z-[9999] w-auto min-w-[120px]"
                  sideOffset={4}
                  avoidCollisions={true}
                  position="popper"
                >
                  {locales.map((locale) => (
                    <SelectItem
                      key={locale}
                      value={locale}
                      aria-label={t('switchTo', {
                        language: localeNames[locale]
                      })}
                    >
                      <span className="flex items-center gap-2 whitespace-nowrap">
                        <Flag
                          countryCode={localeFlagCodes[locale]}
                          style={{
                            width: '1rem',
                            height: '0.75rem'
                          }}
                          alt=""
                          role="presentation"
                        />
                        {localeNames[locale]}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
