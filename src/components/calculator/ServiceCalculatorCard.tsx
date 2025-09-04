'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { NumberInput } from './NumberInput'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { calcPrice } from '@/lib/calculator/calc'
import {
  gymPrices,
  ticketBookPrices,
  membershipPrices,
  MembershipPeriod,
  MembershipCategory
} from '@/lib/calculator/price-tables'
import { CalcInput, Category, TimeSlot, Coupon, ServiceType } from '@/lib/calculator/types'

type Season = 'summer' | 'normal'

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
  const [season, setSeason] = useState<Season>('normal')
  const [slot, setSlot] = useState<TimeSlot>('day')
  const [category, setCategory] = useState<Category>('adult')
  const [coupon] = useState<Coupon>('none')
  const [membershipPeriod, setMembershipPeriod] = useState<MembershipPeriod>('1year')
  const [lockerQuantity, setLockerQuantity] = useState<number>(1)
  const [result, setResult] = useState<string>('')

  // ジム用の区分と人数の管理
  interface GymItem {
    id: string
    category: Category
    quantity: number
  }
  const [gymItems, setGymItems] = useState<GymItem[]>([
    { id: 'gym-initial', category: 'adult', quantity: 1 }
  ])

  // プール用の区分と人数の管理
  interface PoolItem {
    id: string
    category: Category
    quantity: number
    coupon: Coupon
  }
  const [poolItems, setPoolItems] = useState<PoolItem[]>([
    { id: 'pool-initial', category: 'adult', quantity: 1, coupon: 'none' }
  ])

  const categoryLabels = useMemo(
    () => ({
      adult: '大人',
      companionAdult: '同伴者大人',
      senior: 'シルバー(65歳以上)',
      student: '小・中・高生',
      preschooler: '3歳以上(就学前)',
      under2: '2歳以下',
      poolUser: '会員・プール利用者',
      membership: '会員'
    }),
    []
  )

  // ジム用の特別カテゴリラベル（会員・プール利用者向け）
  const gymCategoryLabels = useMemo(
    () => ({
      adult: '大人',
      student: '小・中・高生',
      poolUser: '会員・プール利用者',
      companionAdult: '',
      senior: '',
      preschooler: '',
      under2: '',
      membership: ''
    }),
    []
  )

  const timeSlotLabels: Record<TimeSlot, string> = {
    day: '日中料金(開館〜午後5時)',
    evening: 'イブニング料金(午後5時以降)'
  }

  const seasonLabels: Record<Season, string> = {
    normal: '通常営業(9〜6月)',
    summer: '夏季営業(7・8月)'
  }

  const couponLabels: Record<Coupon, string> = {
    none: 'なし',
    riloClub: 'リロクラブ',
    joymate: 'ジョイメイトしまね',
    saninActive: '山陰アクティブクラブ',
    disability: '障害者割引'
  }

  const membershipPeriodLabels: Record<MembershipPeriod, string> = {
    '30days': '30日',
    halfYear: '半年',
    '1year': '1年'
  }

  const membershipCategoryLabels: Record<MembershipCategory, string> = {
    adult: '大人',
    senior: 'シルバー(65歳以上)',
    student: '小・中・高生',
    family: '家族',
    corporate: '法人'
  }

  const getAvailableCategories = (): Category[] => {
    switch (serviceType) {
      case 'pool':
        return ['adult', 'companionAdult', 'senior', 'student', 'preschooler', 'under2']
      case 'gym':
        // ジムは大人と学生のみ
        return ['adult', 'student']
      case 'locker':
        // ロッカーは区分不要
        return []
      case 'membership':
        // 会員制は専用の区分を使用（後で変換）
        return []
      case 'ticketBook':
        return ['adult', 'senior', 'student', 'preschooler']
      default:
        return []
    }
  }

  // ジム用の特別カテゴリ取得
  const getGymCategories = (): Category[] => {
    return ['adult', 'student', 'poolUser']
  }

  // ジム項目の管理
  const addGymItem = () => {
    const availableCategories = getGymCategories()
    const usedCategories = gymItems.map((item) => item.category)
    const nextCategory = availableCategories.find((cat) => !usedCategories.includes(cat))

    if (nextCategory) {
      const newId = `gym-${Date.now()}-${Math.random()}`
      setGymItems([...gymItems, { id: newId, category: nextCategory, quantity: 1 }])
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

  // 選択可能な区分を取得（既に使用されているものを除く、ただし現在のアイテムは含める）
  const getAvailableCategoriesForItem = (currentItemId: string): Category[] => {
    const usedCategories = gymItems
      .filter((item) => item.id !== currentItemId)
      .map((item) => item.category)
    const currentItem = gymItems.find((item) => item.id === currentItemId)
    const availableCategories = getGymCategories().filter((cat) => !usedCategories.includes(cat))

    // 現在選択中のカテゴリも選択肢に含める
    if (currentItem && !availableCategories.includes(currentItem.category)) {
      availableCategories.push(currentItem.category)
    }

    return availableCategories
  }

  // 追加可能かチェック
  const canAddGymItem = () => {
    const availableCategories = getGymCategories()
    const usedCategories = gymItems.map((item) => item.category)
    return usedCategories.length < availableCategories.length
  }

  // プール項目の管理
  const addPoolItem = () => {
    if (canAddPoolItem()) {
      const availableCategories = getAvailableCategories()
      // デフォルトとして最初の利用可能な区分を選択
      const defaultCategory = availableCategories[0] || 'adult'

      const newId = `pool-${Date.now()}-${Math.random()}`
      setPoolItems([
        ...poolItems,
        { id: newId, category: defaultCategory, quantity: 1, coupon: 'none' }
      ])
    }
  }

  const removePoolItem = (id: string) => {
    if (poolItems.length > 1) {
      setPoolItems(poolItems.filter((item) => item.id !== id))
    }
  }

  const updatePoolItem = (id: string, field: keyof PoolItem, value: Category | number | Coupon) => {
    if (field === 'category') {
      // 既に選択されている区分への変更を防ぐ
      const isAlreadyUsed = poolItems.some((item) => item.id !== id && item.category === value)
      if (isAlreadyUsed) {
        return
      }
    }

    setPoolItems(poolItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  // プール用の選択可能な区分を取得（既に使用されているものを除く、ただし現在のアイテムは含める）
  const getAvailableCategoriesForPoolItem = (currentItemId: string): Category[] => {
    const usedCategories = poolItems
      .filter((item) => item.id !== currentItemId)
      .map((item) => item.category)
    const currentItem = poolItems.find((item) => item.id === currentItemId)
    const availableCategories = getAvailableCategories().filter(
      (cat) => !usedCategories.includes(cat)
    )

    // 現在選択中のカテゴリも選択肢に含める
    if (currentItem && !availableCategories.includes(currentItem.category)) {
      availableCategories.push(currentItem.category)
    }

    return availableCategories
  }

  // プール項目の追加可能かチェック
  const canAddPoolItem = () => {
    // 区分数 × クーポン数 = 最大組み合わせ数 (最大30個まで)
    const maxCombinations = getAvailableCategories().length * Object.keys(couponLabels).length
    return poolItems.length < Math.min(maxCombinations, 30)
  }

  const getAvailableMembershipCategories = (): MembershipCategory[] => {
    const availableCategories = membershipPrices[membershipPeriod]
    return Object.keys(availableCategories) as MembershipCategory[]
  }

  useEffect(() => {
    if (serviceType === 'pool') {
      // プールの場合 - 複数項目の合計計算
      let total = 0
      const details: string[] = []

      poolItems.forEach((item) => {
        const date = season === 'summer' ? new Date(2024, 6, 1) : new Date(2024, 3, 1)
        const input: CalcInput = {
          date,
          slot,
          category: item.category,
          coupon: item.coupon
        }
        const calcResult = calcPrice(input)

        if (calcResult.status === 'ok') {
          const itemTotal = calcResult.price * item.quantity
          total += itemTotal
          details.push(
            `${categoryLabels[item.category]} ${item.quantity}名: ${itemTotal.toLocaleString()}円`
          )
        } else if (calcResult.status === 'not_for_sale') {
          details.push(`${categoryLabels[item.category]}: 販売なし`)
        }
      })

      setResult(`${details.join('\n')}\n合計: ${total.toLocaleString()}円`)
    } else if (serviceType === 'gym') {
      // ジムの場合 - 複数項目の合計計算
      let total = 0
      const details: string[] = []

      gymItems.forEach((item) => {
        if (item.category === 'poolUser') {
          details.push(`${gymCategoryLabels[item.category]} ${item.quantity}名: 0円`)
        } else {
          const unitPrice = gymPrices[item.category] || 0
          const itemTotal = unitPrice * item.quantity
          total += itemTotal
          details.push(
            `${gymCategoryLabels[item.category]} ${item.quantity}名: ${itemTotal.toLocaleString()}円`
          )
        }
      })
      setResult(`${details.join('\n')}\n合計: ${total.toLocaleString()}円`)
    } else if (serviceType === 'locker') {
      // ロッカーの場合
      const totalPrice = 100 * lockerQuantity
      setResult(`料金: ${totalPrice.toLocaleString()}円`)
    } else if (serviceType === 'ticketBook') {
      // 回数券の場合
      const price = ticketBookPrices[category]
      if (price !== undefined) {
        setResult(`料金: ${price.toLocaleString()}円`)
      } else {
        setResult('この組み合わせでは販売されていません')
      }
    } else if (serviceType === 'membership') {
      // 会員制の場合
      const membershipCategory = category as unknown as MembershipCategory
      const price = membershipPrices[membershipPeriod][membershipCategory]
      if (price !== undefined) {
        setResult(`料金: ${price.toLocaleString()}円`)
      } else {
        setResult('この組み合わせでは販売されていません')
      }
    } else {
      setResult('未実装のサービスです')
    }
  }, [
    serviceType,
    season,
    slot,
    category,
    coupon,
    membershipPeriod,
    lockerQuantity,
    gymItems,
    poolItems,
    categoryLabels,
    gymCategoryLabels
  ])

  // 計算結果を親コンポーネントに通知する別のuseEffect
  useEffect(() => {
    let calculatedTotal = 0

    if (serviceType === 'pool') {
      poolItems.forEach((item) => {
        const date = season === 'summer' ? new Date(2024, 6, 1) : new Date(2024, 3, 1)
        const input: CalcInput = {
          date,
          slot,
          category: item.category,
          coupon: item.coupon
        }
        const calcResult = calcPrice(input)
        if (calcResult.status === 'ok') {
          calculatedTotal += calcResult.price * item.quantity
        }
      })
    } else if (serviceType === 'gym') {
      gymItems.forEach((item) => {
        if (item.category !== 'poolUser') {
          const unitPrice = gymPrices[item.category] || 0
          calculatedTotal += unitPrice * item.quantity
        }
      })
    } else if (serviceType === 'locker') {
      calculatedTotal = 100 * lockerQuantity
    } else if (serviceType === 'ticketBook') {
      const price = ticketBookPrices[category]
      if (price !== undefined) {
        calculatedTotal = price
      }
    } else if (serviceType === 'membership') {
      const membershipCategory = category as unknown as MembershipCategory
      const price = membershipPrices[membershipPeriod][membershipCategory]
      if (price !== undefined) {
        calculatedTotal = price
      }
    }

    if (onCalculationChangeRef.current) {
      onCalculationChangeRef.current(calculatedTotal)
    }
  }, [
    serviceType,
    season,
    slot,
    category,
    coupon,
    membershipPeriod,
    lockerQuantity,
    gymItems,
    poolItems
  ])

  // onCalculationChangeを安定化されたref経由で呼び出す
  const onCalculationChangeRef = React.useRef(onCalculationChange)
  onCalculationChangeRef.current = onCalculationChange

  const getServiceTitle = () => {
    switch (serviceType) {
      case 'pool':
        return 'プール'
      case 'gym':
        return 'トレーニングジム'
      case 'locker':
        return 'ロッカー'
      case 'membership':
        return '会員制'
      case 'ticketBook':
        return '回数券(11枚綴り)'
      default:
        return ''
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-semibold text-primary">{getServiceTitle()}</CardTitle>
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
        {/* プールの複数項目設定 */}
        {serviceType === 'pool' && (
          <div className="space-y-4">
            {/* 営業期間と時間帯 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">営業期間</label>
                <Select value={season} onValueChange={(value: Season) => setSeason(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(seasonLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">時間帯</label>
                <Select value={slot} onValueChange={(value: TimeSlot) => setSlot(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(timeSlotLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">利用者</label>
              <Button
                onClick={addPoolItem}
                variant="outline"
                size="sm"
                className="text-xs"
                disabled={!canAddPoolItem()}
              >
                + 追加
              </Button>
            </div>

            {poolItems.map((item) => (
              <Card key={item.id} className="p-4 bg-gray-50 dark:bg-gray-800 relative">
                {/* モバイル: 縦並び */}
                <div className="block md:hidden space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">区分</label>
                    <Select
                      value={item.category}
                      onValueChange={(value: Category) =>
                        updatePoolItem(item.id, 'category', value)
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableCategoriesForPoolItem(item.id).map((categoryKey) => (
                          <SelectItem key={categoryKey} value={categoryKey}>
                            {categoryLabels[categoryKey]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">人数</label>
                    <NumberInput
                      value={item.quantity}
                      onChange={(value) => updatePoolItem(item.id, 'quantity', value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">割引</label>
                    <Select
                      value={item.coupon}
                      onValueChange={(value: Coupon) => updatePoolItem(item.id, 'coupon', value)}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(couponLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* PC: 横並び */}
                <div className="hidden md:grid md:grid-cols-3 md:gap-4 md:items-end">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">区分</label>
                    <Select
                      value={item.category}
                      onValueChange={(value: Category) =>
                        updatePoolItem(item.id, 'category', value)
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableCategoriesForPoolItem(item.id).map((categoryKey) => (
                          <SelectItem key={categoryKey} value={categoryKey}>
                            {categoryLabels[categoryKey]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">人数</label>
                    <NumberInput
                      value={item.quantity}
                      onChange={(value) => updatePoolItem(item.id, 'quantity', value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">割引</label>
                    <Select
                      value={item.coupon}
                      onValueChange={(value: Coupon) => updatePoolItem(item.id, 'coupon', value)}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(couponLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {poolItems.length > 1 && (
                  <Button
                    onClick={() => removePoolItem(item.id)}
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* 会員制の場合は期間と区分選択 */}
        {serviceType === 'membership' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">期間</label>
              <Select
                value={membershipPeriod}
                onValueChange={(value: MembershipPeriod) => setMembershipPeriod(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(membershipPeriodLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">区分</label>
              <Select
                value={category}
                onValueChange={(value: string) => setCategory(value as Category)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableMembershipCategories().map((categoryKey) => (
                    <SelectItem key={categoryKey} value={categoryKey}>
                      {membershipCategoryLabels[categoryKey]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* ロッカーの個数選択 */}
        {serviceType === 'locker' && (
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">個数</label>
            <NumberInput value={lockerQuantity} onChange={setLockerQuantity} />
          </div>
        )}

        {/* ジムの複数項目設定 */}
        {serviceType === 'gym' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">利用者</label>
              <Button
                onClick={addGymItem}
                variant="outline"
                size="sm"
                className="text-xs"
                disabled={!canAddGymItem()}
              >
                + 追加
              </Button>
            </div>

            {gymItems.map((item) => (
              <Card key={item.id} className="p-4 bg-gray-50 dark:bg-gray-800 relative">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 mb-1">区分</label>
                    <Select
                      value={item.category}
                      onValueChange={(value: Category) => updateGymItem(item.id, 'category', value)}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableCategoriesForItem(item.id).map((categoryKey) => (
                          <SelectItem key={categoryKey} value={categoryKey}>
                            {gymCategoryLabels[categoryKey]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">人数</label>
                    <NumberInput
                      value={item.quantity}
                      onChange={(value) => updateGymItem(item.id, 'quantity', value)}
                    />
                  </div>
                </div>

                {gymItems.length > 1 && (
                  <Button
                    onClick={() => removeGymItem(item.id)}
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* その他サービスの区分選択 */}
        {serviceType !== 'membership' &&
          serviceType !== 'locker' &&
          serviceType !== 'gym' &&
          serviceType !== 'pool' &&
          getAvailableCategories().length > 0 && (
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium">区分</label>
              <Select value={category} onValueChange={(value: Category) => setCategory(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableCategories().map((categoryKey) => (
                    <SelectItem key={categoryKey} value={categoryKey}>
                      {categoryLabels[categoryKey]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

        {result && (
          <div className="mt-4 p-4 bg-muted rounded-md">
            <pre className="text-sm font-medium whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
