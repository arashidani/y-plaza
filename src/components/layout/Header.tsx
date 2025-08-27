'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { type Locale } from '@/constants/locales'
import { locales, localeNames, localeFlagCodes } from '@/lib/i18n'
import { Globe } from 'lucide-react'
import { Flag } from '@/components/ui/flag'
import { Link, useRouter, usePathname } from '@/i18n/routing'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const currentLocale = params.locale as Locale
  const t = useTranslations('header')

  const handleLanguageChange = (value: Locale) => {
    router.push(pathname, { locale: value })
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-primary hover:text-primary/80 transition-colors flex-shrink-0 text-center leading-tight">
          {t('title').length > 25 ? (
            <div className="text-base sm:text-xl">
              {t('title').split(' ').length > 1 ? (
                <>
                  {t('title').split(' ').slice(0, Math.ceil(t('title').split(' ').length / 2)).join(' ')}
                  <br />
                  {t('title').split(' ').slice(Math.ceil(t('title').split(' ').length / 2)).join(' ')}
                </>
              ) : (
                <div className="text-lg sm:text-xl">{t('title')}</div>
              )}
            </div>
          ) : (
            <div className="text-xl sm:text-2xl">{t('title')}</div>
          )}
        </Link>
        
        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
          <ThemeToggle />
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Globe className="h-4 w-4 text-muted-foreground hidden sm:inline" />
            <div className="relative">
              <Select value={currentLocale} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-20 sm:w-36 relative">
                  <SelectValue placeholder={t('language')}>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Flag
                        countryCode={localeFlagCodes[currentLocale]}
                        style={{
                          width: '1rem',
                          height: '0.75rem',
                        }}
                      />
                      <span className="hidden sm:inline">{localeNames[currentLocale]}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent 
                  side="bottom" 
                  align="end" 
                  className="z-[9999] min-w-[120px] w-auto"
                  sideOffset={4}
                  avoidCollisions={true}
                  position="popper"
                >
                  {locales.map((locale) => (
                    <SelectItem key={locale} value={locale}>
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <Flag
                          countryCode={localeFlagCodes[locale]}
                          style={{
                            width: '1rem',
                            height: '0.75rem',
                          }}
                        />
                        {localeNames[locale]}
                      </div>
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