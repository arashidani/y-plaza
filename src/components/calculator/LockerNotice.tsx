'use client'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

interface LockerNoticeProps {
  onAddLocker: () => void
}

// プール利用時のロッカー追加を促す注意喚起コンポーネント
export function LockerNotice({ onAddLocker }: LockerNoticeProps) {
  const t = useTranslations('poolCalculator')

  return (
    <div className="rounded-lg border border-orange-300 bg-orange-50 p-3 dark:border-orange-700 dark:bg-orange-950/50">
      <div className="flex items-center gap-2 text-sm text-orange-800 dark:text-orange-200">
        <span>⚠️</span>
        <div className="flex-1">
          <div className="font-medium">{t('lockerRequired')}</div>
          <div className="mt-1 text-xs">
            {t('lockerShareNote')}
          </div>
        </div>
        <Button
          onClick={onAddLocker}
          size="sm"
          className="ml-auto text-xs"
          aria-label={t('addLockerDescription')}
        >
          {t('addLocker')}
        </Button>
      </div>
    </div>
  )
}
