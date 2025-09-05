'use client'

import { YenMono } from './YenMono'

interface SummaryRowProps {
  label: string
  value: number
}

export function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <span className="min-w-0 flex-1 break-words">{label}</span>
      <YenMono value={value} className="flex-shrink-0 font-medium" />
    </div>
  )
}
