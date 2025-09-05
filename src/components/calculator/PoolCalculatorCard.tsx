'use client'

import { useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { getServiceTypeLabel } from '@/lib/calculator/labels'
import { PoolEditor } from './editors/PoolEditor'
import { usePoolCalculator } from './hooks/usePoolCalculator'

interface PoolCalculatorCardProps {
  onRemove: () => void
  onCalculationChange?: (total: number) => void
}

export function PoolCalculatorCard({ onRemove, onCalculationChange }: PoolCalculatorCardProps) {
  const { state, actions, total, message } = usePoolCalculator()

  const onCalcRef = useRef(onCalculationChange)
  onCalcRef.current = onCalculationChange

  useEffect(() => {
    if (onCalcRef.current) onCalcRef.current(total)
  }, [total])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-semibold text-primary">
          {getServiceTypeLabel('pool')}
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
        <PoolEditor state={state} actions={actions} />

        {message && (
          <div className="mt-4 p-4 bg-muted rounded-md">
            <pre className="text-sm font-medium whitespace-pre-wrap">{message}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
