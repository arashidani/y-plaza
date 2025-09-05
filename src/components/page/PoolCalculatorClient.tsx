'use client'

import { TestCalculator } from '@/components/calculator/TestCalculator'
import { useTranslations } from 'next-intl'

export function PoolCalculatorClient() {
  const t = useTranslations()

  return (
    <main className="pool-calculator-container">
      <h1 className="pool-calculator-title">
        {t('poolCalculator.title', { defaultValue: 'プール料金 計算ツール' })}
      </h1>
      <p className="mt-2 text-sm text-gray-700">
        <a
          href="https://y-plaza.sakura.ne.jp/payment"
          className="rounded-sm font-medium text-blue-700 underline hover:text-blue-800 hover:no-underline focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:outline-none"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('poolCalculator.publicInfoLinkDescription', {
            defaultValue: '出雲ゆうプラザの公式料金情報ページを新しいタブで開く'
          })}
        >
          {t('poolCalculator.publicInfoLink', { defaultValue: '公開情報' })}
          <span className="sr-only">
            {t('poolCalculator.externalLink', {
              defaultValue: '（外部リンク、新しいタブで開きます）'
            })}
          </span>
        </a>
        {t('poolCalculator.publicInfoNote', {
          defaultValue:
            'を基に作成した試算用ツールです。最終的な金額は施設の最新案内をご確認ください。'
        })}
      </p>
      <div className="mt-4">
        <TestCalculator />
      </div>
    </main>
  )
}
