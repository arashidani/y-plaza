'use client'
import { Button } from '@/components/ui/button'

interface LockerNoticeProps {
  onAddLocker: () => void
}

// プール利用時のロッカー追加を促す注意喚起コンポーネント
export function LockerNotice({ onAddLocker }: LockerNoticeProps) {
  return (
    <div className="rounded-lg border border-orange-300 bg-orange-50 p-3 dark:border-orange-700 dark:bg-orange-950/50">
      <div className="flex items-center gap-2 text-sm text-orange-800 dark:text-orange-200">
        <span>⚠️</span>
        <div className="flex-1">
          <div className="font-medium">プール利用時はロッカーが必要です</div>
          <div className="mt-1 text-xs">
            2人程度での共有は可能ですが、着替えスペースの関係上、3人以上での共有はできません
          </div>
        </div>
        <Button
          onClick={onAddLocker}
          size="sm"
          className="ml-auto text-xs"
          aria-label="プール利用に必要なロッカーをサービス項目に追加する"
        >
          ロッカー追加
        </Button>
      </div>
    </div>
  )
}
