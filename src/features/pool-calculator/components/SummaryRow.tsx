import { YenMono } from './YenMono'

interface SummaryRowProps {
  label: string;
  value: number;
}

export function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="grid grid-cols-4 items-baseline gap-3 text-sm">
      <span className="col-span-3">{label}</span>
      <YenMono value={value} className="w-28 font-medium" />
    </div>
  )
}