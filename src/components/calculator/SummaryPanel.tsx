'use client'

import { Section } from './Section'
import { SummaryRow } from './SummaryRow'
import { YenMono } from './YenMono'
import { ServiceType } from '@/lib/calculator/types'
import { SERVICE_ORDER } from '@/lib/calculator/constants'
import { getServiceTypeLabel } from '@/lib/calculator/labels'

interface SummaryPanelProps {
  subtotal: Record<ServiceType, number>
  total: number
}

export function SummaryPanel({ subtotal, total }: SummaryPanelProps) {
  const items = SERVICE_ORDER.map((key) => ({
    key,
    value: subtotal[key],
    label: `${getServiceTypeLabel(key)} 小計`
  }))

  return (
    <Section title="内訳">
      <div className="space-y-2">
        {items.map(
          (item) => item.value > 0 && (
            <SummaryRow key={item.key} label={item.label} value={item.value} />
          )
        )}
        <div className="h-px bg-gray-200" />
        <div
          className="flex items-center justify-between text-base"
          role="status"
          aria-live="polite"
        >
          <span className="font-semibold">合計</span>
          <YenMono value={total} className="text-lg font-bold" aria-label={`合計金額 ${total}円`} />
        </div>
      </div>
    </Section>
  )
}
