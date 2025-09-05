'use client'

import { PoolCalculatorCard } from './PoolCalculatorCard'
import { GymCalculatorCard } from './GymCalculatorCard'
import { LockerCalculatorCard } from './LockerCalculatorCard'
import { MembershipCalculatorCard } from './MembershipCalculatorCard'
import { TicketBookCalculatorCard } from './TicketBookCalculatorCard'
import type { ServiceType } from '@/lib/calculator/types'

interface ServiceCalculatorCardProps {
  serviceType: ServiceType
  onRemove: () => void
  onCalculationChange?: (total: number) => void
}

export function ServiceCalculatorCard({ serviceType, onRemove, onCalculationChange }: ServiceCalculatorCardProps) {
  switch (serviceType) {
    case 'pool':
      return <PoolCalculatorCard onRemove={onRemove} onCalculationChange={onCalculationChange} />
    case 'gym':
      return <GymCalculatorCard onRemove={onRemove} onCalculationChange={onCalculationChange} />
    case 'locker':
      return <LockerCalculatorCard onRemove={onRemove} onCalculationChange={onCalculationChange} />
    case 'membership':
      return <MembershipCalculatorCard onRemove={onRemove} onCalculationChange={onCalculationChange} />
    case 'ticketBook':
      return <TicketBookCalculatorCard onRemove={onRemove} onCalculationChange={onCalculationChange} />
    default:
      return null
  }
}
