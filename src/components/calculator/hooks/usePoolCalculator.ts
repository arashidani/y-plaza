'use client'

import { useCallback, useMemo, useState } from 'react'
import type { Category, Coupon, Season, TimeSlot } from '@/lib/calculator/types'
import type { PoolItem } from '../../calculator/types'
import { calculatePool } from '@/lib/calculator/service-calculators'
import {
  allowedCategoriesForService,
  canAddPool,
  findFirstAvailablePoolCombo
} from '@/lib/calculator/category-availability'
import { ALL_COUPONS } from '@/lib/calculator/labels'
import { uniqueId } from '@/lib/calculator/utils'
import {
  findAlternativeCouponForCategory,
  isDuplicatePoolCombo
} from '@/lib/calculator/pool-helpers'

export interface UsePoolCalculatorState {
  season: Season
  slot: TimeSlot
  items: PoolItem[]
}

export interface UsePoolCalculatorActions {
  setSeason: (s: Season) => void
  setSlot: (s: TimeSlot) => void
  addItem: () => void
  removeItem: (id: string) => void
  updateItem: (
    id: string,
    field: keyof PoolItem,
    value: Category | number | Coupon
  ) => void
}

export interface UsePoolCalculatorResult {
  state: UsePoolCalculatorState
  actions: UsePoolCalculatorActions
  total: number
  details: string[]
  message: string
}

export function usePoolCalculator(): UsePoolCalculatorResult {
  const [season, setSeason] = useState<Season>('normal')
  const [slot, setSlot] = useState<TimeSlot>('day')
  const [items, setItems] = useState<PoolItem[]>([
    { id: uniqueId('pool'), category: 'adult', quantity: 1, coupon: 'none' }
  ])

  const addItem = useCallback(() => {
    // 上限確認
    if (!canAddPool(items, ALL_COUPONS.length)) return
    const categories = allowedCategoriesForService('pool')
    const next = findFirstAvailablePoolCombo(items, categories, ALL_COUPONS)
    if (!next) return
    setItems((prev) => [
      ...prev,
      {
        id: uniqueId('pool'),
        category: next.category,
        quantity: 1,
        coupon: next.coupon
      }
    ])
  }, [items])

  const removeItem = useCallback((id: string) => {
    setItems((prev) =>
      prev.length > 1 ? prev.filter((i) => i.id !== id) : prev
    )
  }, [])

  const updateItem = useCallback(
    (id: string, field: keyof PoolItem, value: Category | number | Coupon) => {
      setItems((prev) => {
        const current = prev.find((i) => i.id === id)
        if (!current) return prev

        const nextCategory =
          field === 'category' ? (value as Category) : current.category
        let nextCoupon = field === 'coupon' ? (value as Coupon) : current.coupon

        if (isDuplicatePoolCombo(prev, id, nextCategory, nextCoupon)) {
          const alternative = findAlternativeCouponForCategory(
            prev,
            id,
            nextCategory,
            ALL_COUPONS
          )
          if (!alternative) return prev
          nextCoupon = alternative
        }

        return prev.map((item) =>
          item.id === id
            ? {
                ...item,
                category: nextCategory,
                coupon: nextCoupon,
                ...(field === 'quantity' ? { quantity: value as number } : {})
              }
            : item
        )
      })
    },
    []
  )

  const { total, details, message } = useMemo(() => {
    const { total: t, details: d } = calculatePool(items, season, slot)
    return {
      total: t,
      details: d,
      message: `${d.join('\n')}\n合計: ${t.toLocaleString()}円`
    }
  }, [items, season, slot])

  return {
    state: { season, slot, items },
    actions: { setSeason, setSlot, addItem, removeItem, updateItem },
    total,
    details,
    message
  }
}
