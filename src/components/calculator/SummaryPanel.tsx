'use client'

import { Section } from './Section'
import { SummaryRow } from './SummaryRow'
import { YenMono } from './YenMono'
import { ServiceType } from '@/lib/calculator/types'
import { SERVICE_ORDER } from '@/lib/calculator/constants'
import { useTranslations } from 'next-intl'

interface SummaryPanelProps {
  subtotal: Record<ServiceType, number>
  total: number
}

export function SummaryPanel({ subtotal, total }: SummaryPanelProps) {
  const t = useTranslations('poolCalculator')
  const items = SERVICE_ORDER.map((key) => ({
    key,
    value: subtotal[key],
    label: t(`subtotal.${key === 'ticketBook' ? 'coupon' : key}`)
  }))

  return (
    <Section title={t('breakdown')}>
      <div className="space-y-2">
        {items.map(
          (item) =>
            item.value > 0 && (
              <SummaryRow
                key={item.key}
                label={item.label}
                value={item.value}
              />
            )
        )}
        <div className="h-px bg-gray-200" />
        <div className="flex items-center justify-between text-base" role="status" aria-live="polite">
          <span className="font-semibold">{t('total')}</span>
          <YenMono value={total} className="text-lg font-bold" aria-label={t('totalAmount', { amount: total })} />
        </div>
      </div>
    </Section>
  )
}
