'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { type Locale } from '@/constants/locales'
import { locales, localeNames, localeFlagCodes, isValidLocale, defaultLocale } from '@/lib/i18n'
import { Globe } from 'lucide-react'
import { Flag } from '@/components/ui/flag'
import { Link, useRouter, usePathname } from '@/i18n/routing'
import {
  useParams,
  useSearchParams,
  useRouter as useNextRouter
} from 'next/navigation'
import { useTranslations } from 'next-intl'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { MobileMenu } from '@/components/layout/MobileMenu'

export function Header() {
  const router = useRouter()
  const nextRouter = useNextRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const params = useParams()
  const rawLocale = params.locale as string | undefined
  const currentLocale: Locale = isValidLocale(rawLocale ?? '')
    ? (rawLocale as Locale)
    : defaultLocale
  const t = useTranslations('header')
  const tFooter = useTranslations('footer')

  const stripLocalePrefix = (path: string) => {
    const m = path.match(/^\/(ja|en|pt)(\/.*)?$/)
    if (m) return m[2] || '/'
    return path || '/'
  }

  const prefetchLocales = () => {
    const qs = searchParams?.toString()
    const basePath = stripLocalePrefix(pathname)
    locales
      .filter((l) => l !== currentLocale)
      .forEach((l) => {
        try {
          const path = `/${l}${basePath === '/' ? '' : basePath}`
          const href = qs ? `${path}?${qs}` : path
          nextRouter.prefetch(href)
        } catch {}
      })
  }

  const handleLanguageChange = (value: Locale) => {
    const qs = searchParams?.toString()
    const basePath = stripLocalePrefix(pathname)
    const targetPath = basePath
    const href = qs ? `${targetPath}?${qs}` : targetPath
    router.push(href, { locale: value })
  }

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-3">
          <MobileMenu />
          <Link
            href="/"
            locale={currentLocale}
            className="text-primary hover:text-primary/80 flex-shrink-0 text-center leading-tight font-bold transition-colors"
          >
            <div className="text-base sm:text-xl">
              {(() => {
                const title = t('title')
                // スペースがある言語は単語ベースで分割
                if (title.includes(' ')) {
                  const words = title.split(' ')
                  const mid = Math.ceil(words.length / 2)
                  return (
                    <>
                      {words.slice(0, mid).join(' ')}
                      <br />
                      {words.slice(mid).join(' ')}
                    </>
                  )
                }
                // スペースが無い（日本語など）はコードポイント単位で中央分割
                const glyphs = Array.from(title)
                const mid = Math.ceil(glyphs.length / 2)
                return (
                  <>
                    {glyphs.slice(0, mid).join('')}
                    <br />
                    {glyphs.slice(mid).join('')}
                  </>
                )
              })()}
            </div>
          </Link>
        </div>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
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
                onOpenChange={(open) => {
                  if (open) prefetchLocales()
                }}
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
