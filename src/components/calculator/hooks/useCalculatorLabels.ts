'use client'

import { useTranslations } from 'next-intl'
import type {
  ServiceType,
  Category,
  TimeSlot,
  Coupon,
  Season
} from '@/lib/calculator/types'
import type {
  MembershipCategory,
  MembershipPeriod
} from '@/lib/calculator/price-tables'

export function useCalculatorLabels() {
  const t = useTranslations('poolCalculator')

  const getServiceTypeLabel = (type: ServiceType) =>
    t(`type.${type === 'ticketBook' ? 'coupon' : type}`)

  const getCategoryLabel = (category: Category) =>
    t(`labels.category.${category}`)

  const getGymCategoryLabel = (category: Category) =>
    t(`labels.category.${category}`)

  const getCouponLabel = (coupon: Coupon) => t(`labels.coupon.${coupon}`)

  const getTimeSlotLabel = (slot: TimeSlot) => t(`labels.timeSlot.${slot}`)

  const getSeasonLabel = (season: Season) => t(`labels.season.${season}`)

  const getMembershipPeriodLabel = (period: MembershipPeriod) =>
    t(`labels.membershipPeriod.${period}`)

  const getMembershipCategoryLabel = (category: MembershipCategory) =>
    t(`labels.membershipCategory.${category}`)

  const seasons: Season[] = ['normal', 'summer']
  const timeSlots: TimeSlot[] = ['day', 'evening']

  return {
    // getters
    getServiceTypeLabel,
    getCategoryLabel,
    getGymCategoryLabel,
    getCouponLabel,
    getTimeSlotLabel,
    getSeasonLabel,
    getMembershipPeriodLabel,
    getMembershipCategoryLabel,
    // option lists
    seasons,
    timeSlots
  }
}
