'use client'

import { ServiceType } from '@/lib/calculator/types'
import { ServiceCalculatorCard } from './ServiceCalculatorCard'

interface ServiceOrderListProps {
  order: ServiceType[]
  selected: ServiceType[]
  onRemove: (service: ServiceType) => void
  onCalculationChange: (service: ServiceType, total: number) => void
}

export function ServiceOrderList({
  order,
  selected,
  onRemove,
  onCalculationChange
}: ServiceOrderListProps) {
  return (
    <>
      {order
        .filter((service) => selected.includes(service))
        .map((service) => (
          <ServiceCalculatorCard
            key={service}
            serviceType={service}
            onRemove={() => onRemove(service)}
            onCalculationChange={(total) => onCalculationChange(service, total)}
          />
        ))}
    </>
  )
}

