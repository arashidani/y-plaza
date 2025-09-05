"use client"

import { useMemo, useState } from 'react'
import { calculateLocker } from '@/lib/calculator/service-calculators'
import { useTranslations } from 'next-intl'
import { formatCurrencyWithI18n } from '@/lib/calculator/utils'

export function useLockerCalculator() {
  const [quantity, setQuantity] = useState<number>(1)
  const tCalc = useTranslations('poolCalculator')
  const tCommon = useTranslations('common')

  const { total, message } = useMemo(() => {
    const { total: t } = calculateLocker(quantity)
    return {
      total: t,
      message: `${tCalc('price')}: ${formatCurrencyWithI18n(t, (key) => tCommon(key))}`
    }
  }, [quantity, tCalc, tCommon])

  return { state: { quantity }, actions: { setQuantity }, total, message }
}

