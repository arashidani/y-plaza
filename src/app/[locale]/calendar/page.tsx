import React from 'react'
import { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { generateLocaleParams } from '@/lib/static-params'
import { SimpleCalendar } from '@/components/calendar/SimpleCalendar'
import { getEvents } from '@/data/events'
import { HOLIDAYS_BY_YEAR } from '@/data/holidays'
import { listClosedDateStringsOfYear } from '@/lib/calendar/closures'
import {
  CLOSED_BACKGROUND_COLOR,
  getAreaCategoryColor
} from '@/constants/calendar'
import { SUPPORTED_LOCALES, type Locale } from '@/constants/locales'

export const runtime = 'nodejs'
export const dynamic = 'force-static'
export const revalidate = 86400

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateStaticParams() {
  return generateLocaleParams()
}

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const { locale } = await params
  const baseURL =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.azarashi.work'
  return {
    title: 'カレンダー | 出雲ゆうプラザ',
    alternates: {
      canonical: `${baseURL}/${locale}/calendar`
    }
  }
}

export default async function CalendarPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('calendar')
  const raw = await getEvents()
  const pick = (v?: { ja: string; en: string; pt: string } | null) => {
    if (!v) return undefined
    const key: Locale = (SUPPORTED_LOCALES as readonly string[]).includes(
      locale
    )
      ? (locale as Locale)
      : 'ja'
    return v[key] || v.ja || v.en || ''
  }
  const events = raw
    .filter((e) => e.published)
    .map((e) => {
      const start = e.starts_at
        ? `${e.date}T${e.starts_at}`
        : `${e.date}T00:00:00`
      const end = e.ends_at ? `${e.date}T${e.ends_at}` : undefined
      const color = e.color ?? getAreaCategoryColor(e.areaCategory) ?? undefined
      return {
        id: e.id,
        title: pick(e.title) || 'Untitled',
        start,
        end,
        allDay: !e.starts_at && !e.ends_at,
        backgroundColor: color,
        borderColor: color,
        extendedProps: {
          instructor: pick(e.instructor),
          areaCategory: e.areaCategory
        }
      }
    })

  // 休館日の背景イベントを生成
  const currentYear = new Date().getFullYear()
  const years = Array.from(
    new Set([
      currentYear,
      ...Object.keys(HOLIDAYS_BY_YEAR).map((y) => Number(y))
    ])
  ).sort()
  const closedDates = years.flatMap((y) => listClosedDateStringsOfYear(y))
  const holidayDates = years.flatMap((y) => HOLIDAYS_BY_YEAR[y]?.dates ?? [])
  const closedBgEvents = closedDates.map((ds) => ({
    id: `closed-${ds}`,
    title: '',
    start: ds,
    allDay: true,
    display: 'background' as const,
    backgroundColor: CLOSED_BACKGROUND_COLOR,
    borderColor: CLOSED_BACKGROUND_COLOR
  }))

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex items-center">
            <div className="mr-2 text-yellow-600">⚠️</div>
            <div>
              <p className="text-sm font-medium text-yellow-800">
                {t('alphaVersion')}
              </p>
              <p className="text-sm text-yellow-700">{t('alphaWarning')}</p>
            </div>
          </div>
        </div>
      </div>
      <SimpleCalendar
        locale={locale}
        events={[...events, ...closedBgEvents]}
        closedDateSet={new Set(closedDates)}
        holidayDateSet={new Set(holidayDates)}
      />
    </div>
  )
}
