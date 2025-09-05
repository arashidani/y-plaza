'use client'

import { useMemo, useState } from 'react'
import type {
  MembershipCategory,
  MembershipPeriod
} from '@/lib/calculator/price-tables'
import { calculateMembership } from '@/lib/calculator/service-calculators'
import { useTranslations } from 'next-intl'
import { formatCurrencyWithI18n } from '@/lib/calculator/utils'

export function useMembershipCalculator() {
  const [period, setPeriod] = useState<MembershipPeriod>('1year')
  const [category, setCategory] = useState<MembershipCategory>('adult')
  const tCalc = useTranslations('poolCalculator')
  const tCommon = useTranslations('common')

  const { total, message } = useMemo(() => {
    const res = calculateMembership(period, category)
    const t = res.total
    const msg = res.available
      ? `${tCalc('price')}: ${formatCurrencyWithI18n(t, (key) => tCommon(key))}`
      : tCalc('notForSale')
    return { total: t, message: msg }
  }, [period, category, tCalc, tCommon])

  return {
    state: { period, category },
    actions: { setPeriod, setCategory },
    total,
    message
  }
}
