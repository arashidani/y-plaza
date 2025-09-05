'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import {
  MembershipPeriod,
  MembershipCategory
} from '@/lib/calculator/price-tables'
import {
  calculateGym,
  calculateLocker,
  calculateTicketBook,
  calculateMembership
} from '@/lib/calculator/service-calculators'
import { Category, ServiceType } from '@/lib/calculator/types'
import type { GymItem } from './types'
import { useCalculatorLabels } from './hooks/useCalculatorLabels'
import { GymEditor } from './editors/GymEditor'
import { LockerQuantityInput } from './editors/LockerQuantityInput'
import { MembershipSelector } from './editors/MembershipSelector'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  allowedCategoriesForService,
  gymEditorCategories
} from '@/lib/calculator/category-availability'
import { uniqueId } from '@/lib/calculator/utils'
import { PoolCalculatorCard } from './PoolCalculatorCard'
import { useTranslations } from 'next-intl'
import { formatCurrencyWithI18n } from '@/lib/calculator/utils'

interface ServiceCalculatorCardProps {
  serviceType: ServiceType
  onRemove: () => void
  onCalculationChange?: (total: number) => void
}

export function ServiceCalculatorCard({
  serviceType,
  onRemove,
  onCalculationChange
}: ServiceCalculatorCardProps) {
  // 共通状態
  const [category, setCategory] = useState<Category>('adult')
  const [membershipPeriod, setMembershipPeriod] =
    useState<MembershipPeriod>('1year')
  const [membershipCategory, setMembershipCategory] =
    useState<MembershipCategory>('adult')
  const [lockerQuantity, setLockerQuantity] = useState<number>(1)
  const [result, setResult] = useState<string>('')
  const tCalc = useTranslations('poolCalculator')
  const tCommon = useTranslations('common')
  const { getGymCategoryLabel, getCategoryLabel } = useCalculatorLabels()

  // ジム・プール用の状態(初期値は1件ずつ)
  const [gymItems, setGymItems] = useState<GymItem[]>([
    { id: uniqueId('gym'), category: 'adult', quantity: 1 }
  ])
  // プールは PoolCalculatorCard に委譲

  // ジム項目の管理
  const addGymItem = () => {
    const allowed = gymEditorCategories()
    const used = gymItems.map((i) => i.category)
    const next = allowed.find((c) => !used.includes(c))
    if (next) {
      const newId = uniqueId('gym')
      setGymItems([...gymItems, { id: newId, category: next, quantity: 1 }])
    }
  }

  const removeGymItem = (id: string) => {
    if (gymItems.length > 1) {
      setGymItems(gymItems.filter((item) => item.id !== id))
    }
  }

  const updateGymItem = (
    id: string,
    field: keyof GymItem,
    value: Category | number
  ) => {
    if (field === 'category') {
      // 既に選択されている区分への変更を防ぐ
      const isAlreadyUsed = gymItems.some(
        (item) => item.id !== id && item.category === value
      )
      if (isAlreadyUsed) {
        return
      }
    }

    setGymItems(
      gymItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    )
  }

  // プールは別カードへ分離したため、このコンポーネントでは扱わない

  // onCalculationChangeを安定化されたref経由で呼び出す
  const onCalculationChangeRef = useRef(onCalculationChange)
  onCalculationChangeRef.current = onCalculationChange

  // 計算と結果文字列生成を一箇所に集約
  useEffect(() => {
    let total = 0
    let message = ''

    switch (serviceType) {
      case 'pool':
        // プールは PoolCalculatorCard 側で計算と通知を実施
        return
      case 'gym': {
        const { total: t, items } = calculateGym(gymItems)
        total = t
        const lines = items.map(
          (it) =>
            `${getGymCategoryLabel(it.category)} ${tCalc('peopleCount', { count: it.quantity })}: ${formatCurrencyWithI18n(it.lineTotal, (key) => tCommon(key))}`
        )
        message = `${lines.join('\n')}\n${tCalc('total')}: ${formatCurrencyWithI18n(total, (key) => tCommon(key))}`
        break
      }
      case 'locker': {
        const { total: t } = calculateLocker(lockerQuantity)
        total = t
        message = `${tCalc('price')}: ${formatCurrencyWithI18n(total, (key) => tCommon(key))}`
        break
      }
      case 'ticketBook': {
        const res = calculateTicketBook(category)
        total = res.total
        message = res.available
          ? `${tCalc('price')}: ${formatCurrencyWithI18n(total, (key) => tCommon(key))}`
          : tCalc('notForSale')
        break
      }
      case 'membership': {
        const res = calculateMembership(membershipPeriod, membershipCategory)
        total = res.total
        message = res.available
          ? `${tCalc('price')}: ${formatCurrencyWithI18n(total, (key) => tCommon(key))}`
          : tCalc('notForSale')
        break
      }
      default: {
        message = ''
      }
    }

    setResult(message)
    if (onCalculationChangeRef.current) onCalculationChangeRef.current(total)
  }, [
    serviceType,
    category,
    membershipPeriod,
    membershipCategory,
    lockerQuantity,
    gymItems,
    tCalc,
    tCommon,
    getGymCategoryLabel
    // プールは別カードで計算
  ])

  return serviceType === 'pool' ? (
    <PoolCalculatorCard
      onRemove={onRemove}
      onCalculationChange={onCalculationChange}
    />
  ) : (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-primary text-lg font-semibold">
          {tCalc(
            `type.${serviceType === 'ticketBook' ? 'coupon' : serviceType}`
          )}
        </CardTitle>
        <Button
          onClick={onRemove}
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label={tCalc('deleteCard')}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {(() => {
          switch (serviceType) {
            case 'membership':
              return (
                <MembershipSelector
                  state={{
                    period: membershipPeriod,
                    category: membershipCategory
                  }}
                  actions={{
                    setPeriod: setMembershipPeriod,
                    setCategory: setMembershipCategory
                  }}
                />
              )
            case 'locker':
              return (
                <LockerQuantityInput
                  value={lockerQuantity}
                  onChange={setLockerQuantity}
                />
              )
            case 'gym':
              return (
                <GymEditor
                  state={{ items: gymItems }}
                  actions={{
                    addItem: addGymItem,
                    removeItem: removeGymItem,
                    updateItem: updateGymItem
                  }}
                />
              )
            case 'ticketBook': {
              const allowed = allowedCategoriesForService(serviceType)
              if (allowed.length === 0) return null
              return (
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium">
                    {tCalc('categoryLabel')}
                  </label>
                  <Select
                    value={category}
                    onValueChange={(v: Category) => setCategory(v)}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {allowed.map((k) => (
                        <SelectItem key={k} value={k}>
                          {getCategoryLabel(k)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )
            }
            default: {
              return null
            }
          }
        })()}

        {result && (
          <div className="bg-muted mt-4 rounded-md p-4">
            <pre className="text-sm font-medium whitespace-pre-wrap">
              {result}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
