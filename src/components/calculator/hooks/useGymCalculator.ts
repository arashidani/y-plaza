'use client'

import { useCallback, useMemo, useState } from 'react'
import type { Category } from '@/lib/calculator/types'
import type { GymItem } from '../../calculator/types'
import { calculateGym } from '@/lib/calculator/service-calculators'
import { gymEditorCategories } from '@/lib/calculator/category-availability'
import { uniqueId } from '@/lib/calculator/utils'
import { useTranslations } from 'next-intl'
import { formatCurrencyWithI18n } from '@/lib/calculator/utils'
import { useCalculatorLabels } from './useCalculatorLabels'

export interface UseGymCalculatorState {
  items: GymItem[]
}

export interface UseGymCalculatorActions {
  addItem: () => void
  removeItem: (id: string) => void
  updateItem: (
    id: string,
    field: keyof GymItem,
    value: Category | number
  ) => void
}

export interface UseGymCalculatorResult {
  state: UseGymCalculatorState
  actions: UseGymCalculatorActions
  total: number
  message: string
}

export function useGymCalculator(): UseGymCalculatorResult {
  const [items, setItems] = useState<GymItem[]>([
    { id: uniqueId('gym'), category: 'adult', quantity: 1 }
  ])

  const addItem = useCallback(() => {
    const allowed = gymEditorCategories()
    const used = items.map((i) => i.category)
    const next = allowed.find((c) => !used.includes(c))
    if (next)
      setItems((prev) => [
        ...prev,
        { id: uniqueId('gym'), category: next, quantity: 1 }
      ])
  }, [items])

  const removeItem = useCallback((id: string) => {
    setItems((prev) =>
      prev.length > 1 ? prev.filter((i) => i.id !== id) : prev
    )
  }, [])

  const updateItem = useCallback(
    (id: string, field: keyof GymItem, value: Category | number) => {
      if (field === 'category') {
        setItems((prev) => {
          const isAlreadyUsed = prev.some(
            (i) => i.id !== id && i.category === value
          )
          if (isAlreadyUsed) return prev
          return prev.map((i) =>
            i.id === id ? { ...i, category: value as Category } : i
          )
        })
      } else {
        setItems((prev) =>
          prev.map((i) =>
            i.id === id ? { ...i, quantity: value as number } : i
          )
        )
      }
    },
    []
  )

  const tCalc = useTranslations('poolCalculator')
  const tCommon = useTranslations('common')
  const { getGymCategoryLabel } = useCalculatorLabels()

  const { total, message } = useMemo(() => {
    const { total: t, items: rows } = calculateGym(items)
    const lines = rows.map(
      (it) =>
        `${getGymCategoryLabel(it.category)} ${tCalc('peopleCount', { count: it.quantity })}: ${formatCurrencyWithI18n(it.lineTotal, (key) => tCommon(key))}`
    )
    return {
      total: t,
      message: `${lines.join('\n')}\n${tCalc('total')}: ${formatCurrencyWithI18n(t, (key) => tCommon(key))}`
    }
  }, [items, getGymCategoryLabel, tCalc, tCommon])

  return {
    state: { items },
    actions: { addItem, removeItem, updateItem },
    total,
    message
  }
}
