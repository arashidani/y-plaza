'use client'

import React, { useState, useCallback } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ServiceType } from '@/lib/calculator/types'
import { ServiceCalculatorCard } from './ServiceCalculatorCard'
import { Section } from './Section'
import { SummaryRow } from './SummaryRow'
import { YenMono } from './YenMono'

export function TestCalculator() {
  const [selectedServices, setSelectedServices] = useState<ServiceType[]>(['pool'])

  // 表示順序を固定用サービス順序
  const serviceOrder: ServiceType[] = ['pool', 'gym', 'locker', 'membership', 'ticketBook']

  // 各サービスの計算結果を管理
  const [serviceTotals, setServiceTotals] = useState<Record<ServiceType, number>>({
    pool: 0,
    gym: 0,
    locker: 0,
    membership: 0,
    ticketBook: 0
  })

  const serviceTypeLabels: Record<ServiceType, string> = {
    pool: 'プール',
    gym: 'トレーニングジム',
    locker: 'ロッカー',
    membership: '会員制',
    ticketBook: '回数券'
  }

  const handleServiceToggle = (service: ServiceType) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    )
  }

  const handleRemoveService = (service: ServiceType) => {
    setSelectedServices((prev) => prev.filter((s) => s !== service))
    // サービスを削除する際は計算結果もリセット
    setServiceTotals((prev) => ({ ...prev, [service]: 0 }))
  }

  const handleClearAll = () => {
    setSelectedServices([])
    // 全クリア時は全ての計算結果をリセット
    setServiceTotals({
      pool: 0,
      gym: 0,
      locker: 0,
      membership: 0,
      ticketBook: 0
    })
  }

  // サービスごとの計算結果を更新
  const handleServiceCalculationChange = useCallback((serviceType: ServiceType, total: number) => {
    setServiceTotals((prev) => ({ ...prev, [serviceType]: total }))
  }, [])

  // 実際の計算結果を使用
  const subtotal = {
    pool: selectedServices.includes('pool') ? serviceTotals.pool : 0,
    gym: selectedServices.includes('gym') ? serviceTotals.gym : 0,
    locker: selectedServices.includes('locker') ? serviceTotals.locker : 0,
    membership: selectedServices.includes('membership') ? serviceTotals.membership : 0,
    ticketBook: selectedServices.includes('ticketBook') ? serviceTotals.ticketBook : 0
  }

  const total = Object.values(subtotal).reduce((sum, value) => sum + value, 0)

  return (
    <div className="space-y-6">
      {/* サービス選択 */}
      <div>
        <h2 className="text-xl font-semibold text-primary mb-4">利用サービス選択</h2>
        <div className="flex flex-wrap gap-4 items-center">
          {serviceOrder.map((service) => (
            <div key={service} className="flex items-center space-x-2">
              <Checkbox
                id={service}
                name={service}
                checked={selectedServices.includes(service)}
                onCheckedChange={() => handleServiceToggle(service)}
              />
              <label htmlFor={service} className="text-sm font-medium cursor-pointer">
                {serviceTypeLabels[service]}
              </label>
            </div>
          ))}

          <Button
            onClick={handleClearAll}
            variant="outline"
            size="sm"
            className="ml-auto border-red-300 text-red-700 bg-red-50 hover:bg-red-100 hover:text-red-800 dark:border-red-600 dark:text-red-400 dark:bg-red-950/30 dark:hover:bg-red-950/50 dark:hover:text-red-300"
            aria-label="すべての選択項目をクリアして計算をリセットする"
          >
            全クリア
          </Button>
        </div>
      </div>

      {/* ロッカー必須案内 */}
      {selectedServices.includes('pool') && !selectedServices.includes('locker') && (
        <div className="p-3 bg-orange-50 dark:bg-orange-950/50 border border-orange-300 dark:border-orange-700 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-orange-800 dark:text-orange-200">
            <span>⚠️</span>
            <div className="flex-1">
              <div className="font-medium">プール利用時はロッカーが必要です</div>
              <div className="text-xs mt-1">
                2人程度での共有は可能ですが、着替えスペースの関係上、3人以上での共有はできません
              </div>
            </div>
            <Button
              onClick={() => handleServiceToggle('locker')}
              size="sm"
              className="ml-auto text-xs"
              aria-label="プール利用に必要なロッカーをサービス項目に追加する"
            >
              ロッカー追加
            </Button>
          </div>
        </div>
      )}

      {/* 選択されたサービスごとのカード */}
      {serviceOrder
        .filter((service) => selectedServices.includes(service))
        .map((service) => (
          <ServiceCalculatorCard
            key={service}
            serviceType={service}
            onRemove={() => handleRemoveService(service)}
            onCalculationChange={(total) => handleServiceCalculationChange(service, total)}
          />
        ))}

      {selectedServices.length === 0 && (
        <Card role="status" aria-live="polite">
          <CardContent className="p-6 text-sm text-gray-600 text-center">
            <p>行がありません。上のチェックボックスから項目を選択してください。</p>
          </CardContent>
        </Card>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-2" data-lazy-load>
        <Section title="内訳">
          <div className="space-y-2">
            {[
              { key: 'pool', value: subtotal.pool, defaultLabel: 'プール入場料 小計' },
              { key: 'gym', value: subtotal.gym, defaultLabel: 'トレーニングジム 小計' },
              { key: 'locker', value: subtotal.locker, defaultLabel: 'ロッカー 小計' },
              { key: 'membership', value: subtotal.membership, defaultLabel: '会員制 小計' },
              { key: 'ticketBook', value: subtotal.ticketBook, defaultLabel: '回数券 小計' }
            ].map(
              (item) =>
                item.value > 0 && (
                  <SummaryRow key={item.key} label={item.defaultLabel} value={item.value} />
                )
            )}
            <div className="h-px bg-gray-200" />
            <div
              className="flex items-center justify-between text-base"
              role="status"
              aria-live="polite"
            >
              <span className="font-semibold">合計</span>
              <YenMono
                value={total}
                className="text-lg font-bold"
                aria-label={`合計金額 ${total}円`}
              />
            </div>
          </div>
        </Section>

        <Section title="メモと注意事項">
          <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
            <li>
              <strong>ロッカーについて：</strong>{' '}
              1回100円。2人程度での共有は可能ですが、着替えスペースの関係上、3人以上での共有はできません。
            </li>
            <li>
              障害者割引は本人分の入場料金・会員券が半額（10円未満切り捨て）。備品関係は通常料金。
            </li>
            <li>
              回数券は
              1冊=11枚綴りの購入金額のみを計上します。（何回分消費するかの減算管理は含みません）
            </li>
            <li>会員の家族等の特殊区分は未対応です。</li>
          </ul>
        </Section>
      </div>

      <footer className="mt-8 text-xs text-gray-500">
        *非公式の参考試算用ツールです。最新の料金・条件は必ず施設の公式情報をご確認ください。
      </footer>
    </div>
  )
}
