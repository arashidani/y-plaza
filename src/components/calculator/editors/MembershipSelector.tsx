'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import type {
  MembershipCategory,
  MembershipPeriod
} from '@/lib/calculator/price-tables'
import {
  membershipPeriodLabels,
  membershipCategoryLabels
} from '@/lib/calculator/labels'
import { membershipCategoriesForPeriod } from '@/lib/calculator/category-availability'

interface MembershipSelectorState {
  period: MembershipPeriod
  category: MembershipCategory
}

interface MembershipSelectorActions {
  setPeriod: (p: MembershipPeriod) => void
  setCategory: (c: MembershipCategory) => void
}

interface MembershipSelectorProps {
  state: MembershipSelectorState
  actions: MembershipSelectorActions
}

export function MembershipSelector({
  state,
  actions
}: MembershipSelectorProps) {
  const { period, category } = state
  const { setPeriod, setCategory } = actions
  const availableCategories = membershipCategoriesForPeriod(period)

  return (
    <>
      <div>
        <label className="block text-sm font-medium mb-2">期間</label>
        <Select
          value={period}
          onValueChange={(v: MembershipPeriod) => setPeriod(v)}
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
          onValueChange={(v: string) => setCategory(v as MembershipCategory)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableCategories.map((k) => (
              <SelectItem key={k} value={k}>
                {membershipCategoryLabels[k]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  )
}
