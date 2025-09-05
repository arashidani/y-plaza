'use client'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { ServiceType } from '@/lib/calculator/types'
import { getServiceTypeLabel } from '@/lib/calculator/labels'

interface ServiceSelectorProps {
  order: ServiceType[]
  selected: ServiceType[]
  onToggle: (service: ServiceType) => void
  onClearAll: () => void
}

export function ServiceSelector({
  order,
  selected,
  onToggle,
  onClearAll
}: ServiceSelectorProps) {
  return (
    <div>
      <h2 className="text-primary mb-4 text-xl font-semibold">
        利用サービス選択
      </h2>
      <div className="flex flex-wrap items-center gap-4">
        {order.map((service) => (
          <div key={service} className="flex items-center space-x-2">
            <Checkbox
              id={service}
              name={service}
              checked={selected.includes(service)}
              onCheckedChange={() => onToggle(service)}
            />
            <label
              htmlFor={service}
              className="cursor-pointer text-sm font-medium"
            >
              {getServiceTypeLabel(service)}
            </label>
          </div>
        ))}

        <Button
          onClick={onClearAll}
          variant="outline"
          size="sm"
          className="ml-auto border-red-300 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 dark:border-red-600 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50 dark:hover:text-red-300"
          aria-label="すべての選択項目をクリアして計算をリセットする"
        >
          全クリア
        </Button>
      </div>
    </div>
  )
}
