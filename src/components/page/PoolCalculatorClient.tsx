'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import type { LineType } from '@/features/pool-calculator/models/types'
import { usePoolCalculator } from '@/features/pool-calculator/hooks/usePoolCalculator'
import { LineEditor } from '@/features/pool-calculator/components/LineEditor'
import { Section } from '@/features/pool-calculator/components/Section'
import { SummaryRow } from '@/features/pool-calculator/components/SummaryRow'
import { YenMono } from '@/features/pool-calculator/components/YenMono'
import { useTranslations } from 'next-intl'
import { AccessibleLink } from '@/components/ui/accessible-link'

export function PoolCalculatorClient() {
  const t = useTranslations()
  const {
    lines,
    enabledTypes,
    total,
    subtotal,
    hasPoolUserOrMember,
    toggleType,
    updateLine,
    deleteLine,
    clear,
  } = usePoolCalculator()

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold">
        {t('poolCalculator.title', { defaultValue: 'プール料金 計算ツール' })}
      </h1>
      <p className="mt-2 text-sm text-gray-700">
        <a
          href="https://y-plaza.sakura.ne.jp/payment"
          className="text-blue-700 hover:text-blue-800 underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-sm font-medium"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('poolCalculator.publicInfoLinkDescription', {
            defaultValue: '出雲ゆうプラザの公式料金情報ページを新しいタブで開く'
          })}
        >
          {t('poolCalculator.publicInfoLink', { defaultValue: '公開情報' })}
          <span className="sr-only">{t('poolCalculator.externalLink', { defaultValue: '（外部リンク、新しいタブで開きます）' })}</span>
        </a>
        {t('poolCalculator.publicInfoNote', {
          defaultValue: 'を基に作成した試算用ツールです。最終的な金額は施設の最新案内をご確認ください。'
        })}
      </p>

      <fieldset className="mt-6">
        <legend className="sr-only">
          {t('poolCalculator.selectServices', { defaultValue: 'サービス項目を選択' })}
        </legend>
        <div className="flex flex-wrap gap-3 items-center">
          {[
            { type: 'pool' as LineType, label: t('poolCalculator.type.pool', { defaultValue: 'プール' }) },
            { type: 'gym' as LineType, label: t('poolCalculator.type.gym', { defaultValue: 'トレーニングジム' }) },
            { type: 'locker' as LineType, label: t('poolCalculator.type.locker', { defaultValue: 'ロッカー' }) },
            { type: 'membership' as LineType, label: t('poolCalculator.type.membership', { defaultValue: '会員券' }) },
            { type: 'coupon' as LineType, label: t('poolCalculator.type.coupon', { defaultValue: '回数券' }) },
          ].map(({ type, label }) => (
            <label key={type} className="inline-flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={enabledTypes.has(type)}
                onCheckedChange={() => toggleType(type)}
                aria-describedby={`${type}-description`}
              />
              <span id={`${type}-description`} className="text-sm">{label}</span>
            </label>
          ))}
        
          <Button
            onClick={clear}
            variant="outline"
            size="sm"
            className="ml-auto border-red-300 text-red-700 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-950/50"
            aria-label={t('poolCalculator.clearAllDescription', { 
              defaultValue: 'すべての選択項目をクリアして計算をリセットする' 
            })}
          >
            {t('poolCalculator.clearAll', { defaultValue: '全クリア' })}
          </Button>
        </div>
      </fieldset>

      {/* ロッカー必須案内 */}
      {enabledTypes.has('pool') && !enabledTypes.has('locker') && (
        <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-950/50 border border-orange-300 dark:border-orange-700 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-orange-800 dark:text-orange-200">
            <span>⚠️</span>
            <div className="flex-1">
              <div className="font-medium">
                {t('poolCalculator.lockerRequired', { defaultValue: 'プール利用時はロッカーが必要です' })}
              </div>
              <div className="text-xs mt-1">
                {t('poolCalculator.lockerShareNote', { defaultValue: '2人程度での共有は可能ですが、着替えスペースの関係上、3人以上での共有はできません' })}
              </div>
            </div>
            <Button
              onClick={() => toggleType('locker')}
              size="sm"
              className="ml-auto text-xs"
              aria-label={t('poolCalculator.addLockerDescription', { 
                defaultValue: 'プール利用に必要なロッカーをサービス項目に追加する' 
              })}
            >
              {t('poolCalculator.addLocker', { defaultValue: 'ロッカー追加' })}
            </Button>
          </div>
        </div>
      )}

      <div className="mt-4 space-y-3">
        {lines.map((line) => (
          <LineEditor
            key={line.id}
            line={line}
            onChange={(ln) => updateLine(line.id, ln)}
            onDelete={() => deleteLine(line.id)}
            hasPoolUserOrMember={hasPoolUserOrMember}
          />
        ))}
        {lines.length === 0 && (
          <Card role="status" aria-live="polite">
            <CardContent className="p-6 text-sm text-gray-600 text-center">
              <p>{t('poolCalculator.noRows', { defaultValue: '行がありません。上のチェックボックスから項目を選択してください。' })}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Section title={t('poolCalculator.breakdown', { defaultValue: '内訳' })}>
          <div className="space-y-2">
            {[
              { key: 'pool', value: subtotal.pool, defaultLabel: 'プール入場料 小計' },
              { key: 'locker', value: subtotal.locker, defaultLabel: 'ロッカー 小計' },
              { key: 'gym', value: subtotal.gym, defaultLabel: 'トレーニングジム 小計' },
              { key: 'membership', value: subtotal.membership, defaultLabel: '会員券 小計' },
              { key: 'coupon', value: subtotal.coupon, defaultLabel: '回数券 小計' },
            ].map(
              (item) =>
                item.value > 0 && (
                  <SummaryRow
                    key={item.key}
                    label={t(`poolCalculator.subtotal.${item.key}`, { defaultValue: item.defaultLabel })}
                    value={item.value}
                  />
                ),
            )}
            <div className="h-px bg-gray-200" />
            <div className="flex items-center justify-between text-base" role="status" aria-live="polite">
              <span className="font-semibold">{t('poolCalculator.total', { defaultValue: '合計' })}</span>
              <YenMono 
                value={total} 
                className="text-lg font-bold" 
                aria-label={t('poolCalculator.totalAmount', { 
                  amount: total,
                  defaultValue: '合計金額 {amount}円' 
                })}
              />
            </div>
          </div>
        </Section>

        <Section title={t('poolCalculator.notes', { defaultValue: 'メモと注意事項' })}>
          <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
            <li>
              <strong>{t('poolCalculator.note.lockerTitle', { defaultValue: 'ロッカーについて：' })}</strong>
              {' '}
              {
                t.rich('poolCalculator.note.lockerDetail', {
                  price: 100,
                  br: () => <br />,
                  link: (chunks) => (
                    <AccessibleLink 
                      href="/locker" 
                      ariaLabel={t('poolCalculator.lockerDetailPageLink', {
                        defaultValue: 'ロッカーの詳細情報ページに移動'
                      })}
                    >
                      {chunks}
                    </AccessibleLink>
                  )
                })
              }
            </li>
            <li>
              {t('poolCalculator.note.discount', { defaultValue: '障害者割引は本人分の入場料金・会員券が半額（10円未満切り捨て）。備品関係は通常料金。' })}
            </li>
            <li>
              {t('poolCalculator.note.coupon', { defaultValue: '回数券は 1冊=11枚綴りの購入金額のみを計上します（何回分消費するかの減算管理は含みません）。' })}
            </li>
            <li>
              {t('poolCalculator.note.family', { defaultValue: '会員の家族等の特殊区分は未対応です。' })}
            </li>
          </ul>
        </Section>
      </div>

      <footer className="mt-8 text-xs text-gray-500">
        {t('poolCalculator.footer', { defaultValue: '*非公式の参考試算用ツールです。最新の料金・条件は必ず施設の公式情報をご確認ください。' })}
      </footer>
    </main>
  )
}