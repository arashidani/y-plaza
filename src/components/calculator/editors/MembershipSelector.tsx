'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import type { MembershipCategory, MembershipPeriod } from '@/lib/calculator/price-tables'
import { membershipCategoriesForPeriod } from '@/lib/calculator/category-availability'
import { useCalculatorLabels } from '../hooks/useCalculatorLabels'
import { useTranslations } from 'next-intl'

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
  const { getMembershipPeriodLabel, getMembershipCategoryLabel } = useCalculatorLabels()
  const t = useTranslations('poolCalculator')

  return (
    <>
      <div>
        <label className="mb-2 block text-sm font-medium">{t('periodLabel')}</label>
        <Select
          value={period}
          onValueChange={(v: MembershipPeriod) => setPeriod(v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(['30days', 'halfYear', '1year'] as MembershipPeriod[]).map((key) => (
              <SelectItem key={key} value={key}>
                {getMembershipPeriodLabel(key)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">{t('categoryLabel')}</label>
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
                {getMembershipCategoryLabel(k)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  )
}
