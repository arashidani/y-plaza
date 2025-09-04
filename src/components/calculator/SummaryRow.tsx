import { YenMono } from './YenMono'

interface SummaryRowProps {
  label: string;
  value: number;
}

export function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <span className="flex-1 min-w-0 break-words">{label}</span>
      <YenMono value={value} className="font-medium flex-shrink-0" />
    </div>
  )
}