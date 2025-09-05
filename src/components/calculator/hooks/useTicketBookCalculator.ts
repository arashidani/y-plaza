'use client'

import { useMemo, useState } from 'react'
import type { Category } from '@/lib/calculator/types'
import { calculateTicketBook } from '@/lib/calculator/service-calculators'
import { allowedCategoriesForService } from '@/lib/calculator/category-availability'
import { useTranslations } from 'next-intl'
import { formatCurrencyWithI18n } from '@/lib/calculator/utils'
import { useCalculatorLabels } from './useCalculatorLabels'

export function useTicketBookCalculator() {
  const [category, setCategory] = useState<Category>('adult')
  const allowed = allowedCategoriesForService('ticketBook')
  const tCalc = useTranslations('poolCalculator')
  const tCommon = useTranslations('common')
  const { getCategoryLabel } = useCalculatorLabels()

  const { total, message } = useMemo(() => {
    const res = calculateTicketBook(category)
    const t = res.total
    const msg = res.available
      ? `${tCalc('price')}: ${formatCurrencyWithI18n(t, (key) => tCommon(key))}`
      : tCalc('notForSale')
    return { total: t, message: msg }
  }, [category, tCalc, tCommon])

  return {
    state: { category },
    actions: { setCategory },
    allowed,
    getCategoryLabel,
    total,
    message
  }
}
