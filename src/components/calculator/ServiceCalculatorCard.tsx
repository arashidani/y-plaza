'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { MembershipPeriod, MembershipCategory } from '@/lib/calculator/price-tables'
import {
  calculatePool,
  calculateGym,
  calculateLocker,
  calculateTicketBook,
  calculateMembership
} from '@/lib/calculator/service-calculators'
import { Category, TimeSlot, Coupon, ServiceType } from '@/lib/calculator/types'
import type { GymItem, PoolItem } from './types'
import { couponLabels, getServiceTypeLabel, getCategoryLabel } from '@/lib/calculator/labels'
import type { Season } from '@/lib/calculator/types'
import { PoolEditor } from './editors/PoolEditor'
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
  gymEditorCategories,
  canAddPool,
  findFirstAvailablePoolCombo
} from '@/lib/calculator/category-availability'
import { uniqueId } from '@/lib/calculator/utils'

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
  const [season, setSeason] = useState<Season>('normal')
  const [slot, setSlot] = useState<TimeSlot>('day')
  const [category, setCategory] = useState<Category>('adult')
  const [coupon] = useState<Coupon>('none')
  const [membershipPeriod, setMembershipPeriod] = useState<MembershipPeriod>('1year')
  const [membershipCategory, setMembershipCategory] = useState<MembershipCategory>('adult')
  const [lockerQuantity, setLockerQuantity] = useState<number>(1)
  const [result, setResult] = useState<string>('')

  // ジム・プール用の状態(初期値は1件ずつ)
  const [gymItems, setGymItems] = useState<GymItem[]>([
    { id: 'gym-initial', category: 'adult', quantity: 1 }
  ])
  const [poolItems, setPoolItems] = useState<PoolItem[]>([
    { id: 'pool-initial', category: 'adult', quantity: 1, coupon: 'none' }
  ])

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

  const updateGymItem = (id: string, field: keyof GymItem, value: Category | number) => {
    if (field === 'category') {
      // 既に選択されている区分への変更を防ぐ
      const isAlreadyUsed = gymItems.some((item) => item.id !== id && item.category === value)
      if (isAlreadyUsed) {
        return
      }
    }

    setGymItems(gymItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  // プール項目の管理
  const addPoolItem = () => {
    if (!canAddPoolItem()) return
    const categories = allowedCategoriesForService('pool')
    const coupons = Object.keys(couponLabels) as Coupon[]
    const next = findFirstAvailablePoolCombo(poolItems, categories, coupons)
    if (!next) return
    const newId = uniqueId('pool')
    setPoolItems([
      ...poolItems,
      { id: newId, category: next.category, quantity: 1, coupon: next.coupon }
    ])
  }

  const removePoolItem = (id: string) => {
    if (poolItems.length > 1) {
      setPoolItems(poolItems.filter((item) => item.id !== id))
    }
  }

  /**
   * プールの行を更新する（区分・人数・割引）。
   * - (category, coupon) の組み合わせは一意制約をかける。
   * - 変更後に重複が生じる場合は、空いている別クーポンへ自動的にスライドさせる。
   */
  const updatePoolItem = (id: string, field: keyof PoolItem, value: Category | number | Coupon) => {
    setPoolItems((prev) => {
      // 対象行を取得（見つからなければ無変更）
      const current = prev.find((i) => i.id === id)
      if (!current) return prev

      // 次の候補値（未指定の方は現値を採用）
      const nextCategory = field === 'category' ? (value as Category) : current.category
      let nextCoupon = field === 'coupon' ? (value as Coupon) : current.coupon

      // (category, coupon) の重複チェック関数（同一IDは除外）
      const isDup = (cat: Category, cpn: Coupon) =>
        prev.some((i) => i.id !== id && i.category === cat && i.coupon === cpn)

      // 衝突した場合は、同じcategoryで未使用のクーポンに自動調整
      if (isDup(nextCategory, nextCoupon)) {
        const allCoupons = Object.keys(couponLabels) as Coupon[]
        const alternative = allCoupons.find((cpn) => !isDup(nextCategory, cpn))
        if (!alternative) return prev
        nextCoupon = alternative
      }

      // 対象行のみ更新（quantity 変更時は数量のみ差し替え）
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
  }

  // プール項目の追加可能かチェック
  const canAddPoolItem = () => canAddPool(poolItems, Object.keys(couponLabels).length, 30)

  // 計算と結果文字列生成を一箇所に集約
  useEffect(() => {
    let total = 0
    let message = ''

    switch (serviceType) {
      case 'pool': {
        const { total: t, details } = calculatePool(poolItems, season, slot)
        total = t
        message = `${details.join('\n')}\n合計: ${total.toLocaleString()}円`
        break
      }
      case 'gym': {
        const { total: t, details } = calculateGym(gymItems)
        total = t
        message = `${details.join('\n')}\n合計: ${total.toLocaleString()}円`
        break
      }
      case 'locker': {
        const { total: t, message: m } = calculateLocker(lockerQuantity)
        total = t
        message = m
        break
      }
      case 'ticketBook': {
        const { total: t, message: m } = calculateTicketBook(category)
        total = t
        message = m
        break
      }
      case 'membership': {
        const { total: t, message: m } = calculateMembership(membershipPeriod, membershipCategory)
        total = t
        message = m
        break
      }
      default: {
        message = '未実装のサービスです'
      }
    }

    setResult(message)
    if (onCalculationChangeRef.current) onCalculationChangeRef.current(total)
  }, [
    serviceType,
    season,
    slot,
    category,
    coupon,
    membershipPeriod,
    membershipCategory,
    lockerQuantity,
    gymItems,
    poolItems
  ])

  // onCalculationChangeを安定化されたref経由で呼び出す
  const onCalculationChangeRef = useRef(onCalculationChange)
  onCalculationChangeRef.current = onCalculationChange

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-semibold text-primary">
          {getServiceTypeLabel(serviceType)}
        </CardTitle>
        <Button
          onClick={onRemove}
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label="カードを削除"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {(() => {
          switch (serviceType) {
            case 'pool':
              return (
                <PoolEditor
                  state={{ season, slot, items: poolItems }}
                  actions={{
                    setSeason,
                    setSlot,
                    addItem: addPoolItem,
                    removeItem: removePoolItem,
                    updateItem: updatePoolItem
                  }}
                />
              )
            case 'membership':
              return (
                <MembershipSelector
                  state={{ period: membershipPeriod, category: membershipCategory }}
                  actions={{ setPeriod: setMembershipPeriod, setCategory: setMembershipCategory }}
                />
              )
            case 'locker':
              return <LockerQuantityInput value={lockerQuantity} onChange={setLockerQuantity} />
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
            default: {
              const allowed = allowedCategoriesForService(serviceType)
              if (allowed.length === 0) return null
              return (
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium">区分</label>
                  <Select value={category} onValueChange={(v: Category) => setCategory(v)}>
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
          }
        })()}

        {result && (
          <div className="mt-4 p-4 bg-muted rounded-md">
            <pre className="text-sm font-medium whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
