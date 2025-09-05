'use client'

import { useState, useCallback } from 'react'
import { ServiceType } from '@/lib/calculator/types'
import { SERVICE_ORDER } from '@/lib/calculator/constants'
import { ServiceOrderList } from './ServiceOrderList'
import { Section } from './Section'
import { ServiceSelector } from './ServiceSelector'
import { LockerNotice } from './LockerNotice'
import { EmptyStateCard } from './EmptyStateCard'
import { SummaryPanel } from './SummaryPanel'

// 初期値をモジュール定数として定義
const INITIAL_TOTALS: Record<ServiceType, number> = {
  pool: 0,
  gym: 0,
  locker: 0,
  membership: 0,
  ticketBook: 0
}

export function TestCalculator() {
  const [selectedServices, setSelectedServices] = useState<ServiceType[]>(['pool'])

  // 表示順序（共通定義）
  const serviceOrder: ServiceType[] = SERVICE_ORDER

  // 各サービスの計算結果を管理
  const [serviceTotals, setServiceTotals] = useState<Record<ServiceType, number>>(INITIAL_TOTALS)

  const handleServiceToggle = useCallback((service: ServiceType) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    )
  }, [])

  const handleRemoveService = useCallback((service: ServiceType) => {
    setSelectedServices((prev) => prev.filter((s) => s !== service))
    // サービスを削除する際は計算結果もリセット
    setServiceTotals((prev) => ({ ...prev, [service]: 0 }))
  }, [])

  const handleClearAll = useCallback(() => {
    setSelectedServices([])
    // 全クリア時は全ての計算結果をリセット
    setServiceTotals(INITIAL_TOTALS)
  }, [])

  // サービスごとの計算結果を更新
  const handleServiceCalculationChange = useCallback((serviceType: ServiceType, total: number) => {
    setServiceTotals((prev) => ({ ...prev, [serviceType]: total }))
  }, [])

  // ロッカー追加のハンドラ（インライン関数を避ける）
  const addLocker = useCallback(() => handleServiceToggle('locker'), [handleServiceToggle])

  // 実際の計算結果を使用（DRY: SERVICE_ORDER から一括生成）
  const { subtotal, total } = SERVICE_ORDER.reduce(
    (acc, key) => {
      const v = selectedServices.includes(key) ? serviceTotals[key] : 0
      acc.subtotal[key] = v
      acc.total += v
      return acc
    },
    { subtotal: {} as Record<ServiceType, number>, total: 0 }
  )

  return (
    <div className="space-y-6">
      {/* サービス選択 */}
      <ServiceSelector
        order={serviceOrder}
        selected={selectedServices}
        onToggle={handleServiceToggle}
        onClearAll={handleClearAll}
      />

      {/* ロッカー必須案内 */}
      {selectedServices.includes('pool') && !selectedServices.includes('locker') && (
        <LockerNotice onAddLocker={addLocker} />
      )}

      {/* 選択されたサービスごとのカード */}
      <ServiceOrderList
        order={serviceOrder}
        selected={selectedServices}
        onRemove={handleRemoveService}
        onCalculationChange={handleServiceCalculationChange}
      />
      {/* 選択されたサービスごとのカードがない時 */}
      {selectedServices.length === 0 && <EmptyStateCard />}

      <div className="mt-8 grid gap-4 md:grid-cols-2" data-lazy-load>
        {/* 内訳セクション */}
        <SummaryPanel subtotal={subtotal} total={total} />

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
