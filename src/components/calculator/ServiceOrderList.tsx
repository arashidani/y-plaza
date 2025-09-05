'use client'

import { memo, useMemo } from 'react'
import { ServiceType } from '@/lib/calculator/types'
import { ServiceCalculatorCard } from './ServiceCalculatorCard'

interface ServiceOrderListProps {
  order: ServiceType[]
  selected: ServiceType[]
  onRemove: (service: ServiceType) => void
  onCalculationChange: (service: ServiceType, total: number) => void
}

function ServiceOrderListBase({
  order,
  selected,
  onRemove,
  onCalculationChange
}: ServiceOrderListProps) {
  // 表示対象のサービスを安定化
  const visible = useMemo(
    () => order.filter((service) => selected.includes(service)),
    [order, selected]
  )

  // サービスごとのハンドラをキャッシュ
  const removeHandlers = useMemo(() => {
    const map: Partial<Record<ServiceType, () => void>> = {}
    visible.forEach((s) => {
      map[s] = () => onRemove(s)
    })
    return map as Record<ServiceType, () => void>
  }, [visible, onRemove])

  const calcHandlers = useMemo(() => {
    const map: Partial<Record<ServiceType, (total: number) => void>> = {}
    visible.forEach((s) => {
      map[s] = (total: number) => onCalculationChange(s, total)
    })
    return map as Record<ServiceType, (total: number) => void>
  }, [visible, onCalculationChange])

  return (
    <>
      {visible.map((service) => (
        <ServiceCalculatorCard
          key={service}
          serviceType={service}
          onRemove={removeHandlers[service]}
          onCalculationChange={calcHandlers[service]}
        />
      ))}
    </>
  )
}

export const ServiceOrderList = memo(ServiceOrderListBase)
