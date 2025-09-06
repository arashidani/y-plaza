'use client'

import { useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTicketBookCalculator } from './hooks/useTicketBookCalculator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import type { Category } from '@/lib/calculator/types'

interface TicketBookCalculatorCardProps {
  onRemove: () => void
  onCalculationChange?: (total: number) => void
}

export function TicketBookCalculatorCard({
  onRemove,
  onCalculationChange
}: TicketBookCalculatorCardProps) {
  const { state, actions, allowed, getCategoryLabel, total, message } =
    useTicketBookCalculator()
  const t = useTranslations('poolCalculator')

  const onCalcRef = useRef(onCalculationChange)
  onCalcRef.current = onCalculationChange

  useEffect(() => {
    if (onCalcRef.current) onCalcRef.current(total)
  }, [total])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-primary text-lg font-semibold">
          {t('type.coupon')}
        </CardTitle>
        <Button
          onClick={onRemove}
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label={t('deleteCard')}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium">{t('categoryLabel')}</label>
          <Select
            value={state.category}
            onValueChange={(v: Category) => actions.setCategory(v)}
          >
            <SelectTrigger className="w-48" aria-label={t('categoryLabel')}>
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

        {message && (
          <div className="bg-muted mt-4 rounded-md p-4">
            <pre className="text-sm font-medium whitespace-pre-wrap">
              {message}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
