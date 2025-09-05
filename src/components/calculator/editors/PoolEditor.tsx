'use client'

import { Button } from '@/components/ui/button'
import { NumberInput } from '../NumberInput'
import { Card } from '@/components/ui/card'
import { X } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import type { Category, Coupon, TimeSlot, Season } from '@/lib/calculator/types'
import type { PoolItem } from '../types'
import {
  getCategoryLabel,
  getCouponLabel,
  seasonLabels,
  timeSlotLabels,
  couponLabels,
  ALL_COUPONS
} from '@/lib/calculator/labels'
import {
  allowedCategoriesForService,
  canAddPool
} from '@/lib/calculator/category-availability'
import { availableCouponsForItem } from '@/lib/calculator/pool-helpers'

interface PoolEditorState {
  season: Season
  slot: TimeSlot
  items: PoolItem[]
}

interface PoolEditorActions {
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

interface PoolEditorProps {
  state: PoolEditorState
  actions: PoolEditorActions
}

export function PoolEditor({ state, actions }: PoolEditorProps) {
  const { season, slot, items } = state
  const {
    setSeason: onChangeSeason,
    setSlot: onChangeSlot,
    addItem: onAddItem,
    removeItem: onRemoveItem,
    updateItem: onUpdateItem
  } = actions

  const allowed = allowedCategoriesForService('pool')
  const canAddItem = canAddPool(items, ALL_COUPONS.length)
  const getAvailableCategoriesForItem = (): Category[] => allowed
  const getAvailableCouponsForItem = (
    id: string
  ): Array<keyof typeof couponLabels> =>
    availableCouponsForItem(
      items as Array<{ id: string; category: Category; coupon: Coupon }>,
      id,
      ALL_COUPONS
    ) as Array<keyof typeof couponLabels>
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">営業期間</label>
          <Select
            value={season}
            onValueChange={(v: Season) => onChangeSeason(v)}
          >
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
          <label className="mb-2 block text-sm font-medium">時間帯</label>
          <Select value={slot} onValueChange={(v: TimeSlot) => onChangeSlot(v)}>
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
          onClick={onAddItem}
          variant="outline"
          size="sm"
          className="text-xs"
          disabled={!canAddItem}
        >
          + 追加
        </Button>
      </div>

      {items.map((item) => (
        <Card
          key={item.id}
          className="relative bg-gray-50 p-4 dark:bg-gray-800"
        >
          {/* モバイル */}
          <div className="block space-y-3 md:hidden">
            <div>
              <label className="mb-1 block text-xs text-gray-600">区分</label>
              <Select
                value={item.category}
                onValueChange={(v: Category) =>
                  onUpdateItem(item.id, 'category', v)
                }
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableCategoriesForItem().map((categoryKey) => (
                    <SelectItem key={categoryKey} value={categoryKey}>
                      {getCategoryLabel(categoryKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-1 block text-xs text-gray-600">人数</label>
              <NumberInput
                value={item.quantity}
                onChange={(v) => onUpdateItem(item.id, 'quantity', v)}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-gray-600">割引</label>
              <Select
                value={item.coupon}
                onValueChange={(v: Coupon) =>
                  onUpdateItem(item.id, 'coupon', v)
                }
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableCouponsForItem(item.id).map((key) => (
                    <SelectItem key={key} value={key}>
                      {getCouponLabel(key as Coupon)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* PC */}
          <div className="hidden md:grid md:grid-cols-3 md:items-end md:gap-4">
            <div>
              <label className="mb-1 block text-xs text-gray-600">区分</label>
              <Select
                value={item.category}
                onValueChange={(v: Category) =>
                  onUpdateItem(item.id, 'category', v)
                }
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableCategoriesForItem().map((categoryKey) => (
                    <SelectItem key={categoryKey} value={categoryKey}>
                      {getCategoryLabel(categoryKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-1 block text-xs text-gray-600">人数</label>
              <NumberInput
                value={item.quantity}
                onChange={(v) => onUpdateItem(item.id, 'quantity', v)}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-gray-600">割引</label>
              <Select
                value={item.coupon}
                onValueChange={(v: Coupon) =>
                  onUpdateItem(item.id, 'coupon', v)
                }
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableCouponsForItem(item.id).map((key) => (
                    <SelectItem key={key} value={key}>
                      {getCouponLabel(key as Coupon)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {items.length > 1 && (
            <button
              onClick={() => onRemoveItem(item.id)}
              className="absolute top-2 right-2 h-8 w-8 text-red-500 hover:text-red-700"
              aria-label="利用者行を削除"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </Card>
      ))}
    </div>
  )
}
