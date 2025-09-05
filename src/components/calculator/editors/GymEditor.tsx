'use client'

import { NumberInput } from '../NumberInput'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import type { Category } from '@/lib/calculator/types'
import type { GymItem } from '../types'
import { X } from 'lucide-react'
import { useCalculatorLabels } from '../hooks/useCalculatorLabels'
import { useTranslations } from 'next-intl'
import {
  gymEditorCategories,
  availableCategoriesExcludingUsed,
  canAddGym
} from '@/lib/calculator/category-availability'

interface GymEditorState {
  items: GymItem[]
}

interface GymEditorActions {
  addItem: () => void
  removeItem: (id: string) => void
  updateItem: (
    id: string,
    field: keyof GymItem,
    value: Category | number
  ) => void
}

interface GymEditorProps {
  state: GymEditorState
  actions: GymEditorActions
}

export function GymEditor({ state, actions }: GymEditorProps) {
  const { items } = state
  const { addItem, removeItem, updateItem } = actions
  const { getGymCategoryLabel } = useCalculatorLabels()
  const t = useTranslations('poolCalculator')

  const canAddItem = canAddGym(items)
  const getAvailableCategoriesForItem = (id: string) =>
    availableCategoriesExcludingUsed(gymEditorCategories(), items, id)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{t('people')}</label>
        <Button
          onClick={addItem}
          variant="outline"
          size="sm"
          className="text-xs"
          disabled={!canAddItem}
        >
          {t('addCategory')}
        </Button>
      </div>

      {items.map((item) => (
        <Card
          key={item.id}
          className="relative bg-gray-50 p-4 dark:bg-gray-800"
        >
          {/* Mobile: stacked controls to avoid truncation */}
          <div className="block space-y-3 md:hidden">
            <div>
              <label className="mb-1 block text-xs text-gray-600">{t('categoryLabel')}</label>
              <Select
                value={item.category}
                onValueChange={(v: Category) => updateItem(item.id, 'category', v)}
              >
                <SelectTrigger className="h-8 w-full" aria-label={t('categoryLabel')}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableCategoriesForItem(item.id).map((categoryKey) => (
                    <SelectItem key={categoryKey} value={categoryKey}>
                      {getGymCategoryLabel(categoryKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-1 block text-xs text-gray-600">{t('people')}</label>
              <NumberInput
                value={item.quantity}
                onChange={(v) => updateItem(item.id, 'quantity', v)}
              />
            </div>
          </div>

          {/* Desktop: inline controls */}
          <div className="hidden items-center gap-2 md:flex">
            <div className="flex-1">
              <label className="mb-1 block text-xs text-gray-600">{t('categoryLabel')}</label>
              <Select
                value={item.category}
                onValueChange={(v: Category) => updateItem(item.id, 'category', v)}
              >
                <SelectTrigger className="h-8" aria-label={t('categoryLabel')}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableCategoriesForItem(item.id).map((categoryKey) => (
                    <SelectItem key={categoryKey} value={categoryKey}>
                      {getGymCategoryLabel(categoryKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-1 block text-xs text-gray-600">{t('people')}</label>
              <NumberInput
                value={item.quantity}
                onChange={(v) => updateItem(item.id, 'quantity', v)}
              />
            </div>
          </div>

          {items.length > 1 && (
            <button
              onClick={() => removeItem(item.id)}
              className="absolute top-2 right-2 h-8 w-8 text-red-500 hover:text-red-700"
              aria-label={t('deleteRow')}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </Card>
      ))}
    </div>
  )
}
