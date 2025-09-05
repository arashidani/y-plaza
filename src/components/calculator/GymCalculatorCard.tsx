'use client'

import { useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { GymEditor } from './editors/GymEditor'
import { useGymCalculator } from './hooks/useGymCalculator'

interface GymCalculatorCardProps {
  onRemove: () => void
  onCalculationChange?: (total: number) => void
}

export function GymCalculatorCard({
  onRemove,
  onCalculationChange
}: GymCalculatorCardProps) {
  const { state, actions, total, message } = useGymCalculator()
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
          {t('type.gym')}
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
        <GymEditor state={state} actions={actions} />
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
