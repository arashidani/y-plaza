'use client'

import { Card, CardContent } from '@/components/ui/card'

// 項目が空の状態を示すカード
export function EmptyStateCard() {
  return (
    <Card role="status" aria-live="polite">
      <CardContent className="p-6 text-center text-sm text-gray-600">
        <p>行がありません。上のチェックボックスから項目を選択してください。</p>
      </CardContent>
    </Card>
  )
}
