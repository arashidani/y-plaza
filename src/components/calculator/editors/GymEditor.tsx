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
import { getGymCategoryLabel } from '@/lib/calculator/labels'
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
  updateItem: (id: string, field: keyof GymItem, value: Category | number) => void
}

interface GymEditorProps {
  state: GymEditorState
  actions: GymEditorActions
}

export function GymEditor({ state, actions }: GymEditorProps) {
  const { items } = state
  const { addItem, removeItem, updateItem } = actions

  const canAddItem = canAddGym(items)
  const getAvailableCategoriesForItem = (id: string) =>
    availableCategoriesExcludingUsed(gymEditorCategories(), items, id)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">利用者</label>
        <Button onClick={addItem} variant="outline" size="sm" className="text-xs" disabled={!canAddItem}>
          + 追加
        </Button>
      </div>

      {items.map((item) => (
        <Card key={item.id} className="p-4 bg-gray-50 dark:bg-gray-800 relative">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="block text-xs text-gray-600 mb-1">区分</label>
              <Select
                value={item.category}
                onValueChange={(v: Category) => updateItem(item.id, 'category', v)}
              >
                <SelectTrigger className="h-8">
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
              <label className="block text-xs text-gray-600 mb-1">人数</label>
              <NumberInput value={item.quantity} onChange={(v) => updateItem(item.id, 'quantity', v)} />
            </div>
          </div>

          {items.length > 1 && (
            <button
              onClick={() => removeItem(item.id)}
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
