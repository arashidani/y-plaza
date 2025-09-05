'use client'

import { Card, CardContent } from '@/components/ui/card'
import { useTranslations } from 'next-intl'

// 項目が空の状態を示すカード
export function EmptyStateCard() {
  const t = useTranslations('poolCalculator')

  return (
    <Card role="status" aria-live="polite">
      <CardContent className="p-6 text-center text-sm text-gray-600">
        <p>{t('noRows')}</p>
      </CardContent>
    </Card>
  )
}
