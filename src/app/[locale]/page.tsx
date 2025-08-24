"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import type { LineType } from '@/features/pool-calculator/models/types';
import { LOCKER_PER_USE } from '@/features/pool-calculator/models/pricing';
import { usePoolCalculator } from '@/features/pool-calculator/hooks/usePoolCalculator';
import { LineEditor } from '@/features/pool-calculator/components/LineEditor';
import { Section } from '@/features/pool-calculator/components/Section';
import { SummaryRow } from '@/features/pool-calculator/components/SummaryRow';
import { YenMono } from '@/features/pool-calculator/components/YenMono';

export default function PoolCalculatorPage() {
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
  } = usePoolCalculator();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold">プール料金 計算ツール（非公式）</h1>
      <p className="mt-2 text-sm text-gray-600">
        <a href="https://example.com/pool-info" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">公開情報</a>
        を基に作成した試算用ツールです。最終的な金額は施設の最新案内をご確認ください。
      </p>

      <div className="mt-6 flex flex-wrap gap-3 items-center">
        {[
          { type: "pool" as LineType, label: "プール" },
          { type: "gym" as LineType, label: "トレーニングジム" },
          { type: "locker" as LineType, label: "ロッカー" },
          { type: "membership" as LineType, label: "会員券" },
          { type: "coupon" as LineType, label: "回数券" },
        ].map(({ type, label }) => (
          <label key={type} className="inline-flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={enabledTypes.has(type)}
              onCheckedChange={() => toggleType(type)}
            />
            <span className="text-sm">{label}</span>
          </label>
        ))}
        
        <Button 
          onClick={clear} 
          variant="outline" 
          size="sm"
          className="ml-auto border-red-300 text-red-700 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-950/50"
        >
          全クリア
        </Button>
      </div>

      {/* ロッカー必須案内 */}
      {enabledTypes.has("pool") && !enabledTypes.has("locker") && (
        <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-950/50 border border-orange-300 dark:border-orange-700 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-orange-800 dark:text-orange-200">
            <span>⚠️</span>
            <div className="flex-1">
              <div className="font-medium">プール利用時はロッカーが必要です</div>
              <div className="text-xs mt-1">2人程度での共有は可能ですが、着替えスペースの関係上、3人以上での共有はできません</div>
            </div>
            <Button
              onClick={() => toggleType("locker")}
              size="sm"
              className="ml-auto text-xs"
            >
              ロッカー追加
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
          <Card>
            <CardContent className="p-6 text-sm text-gray-600 text-center">
              行がありません。上のチェックボックスから項目を選択してください。
            </CardContent>
          </Card>
        )}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Section title="内訳">
          <div className="space-y-2">
            <SummaryRow label="プール入場料 小計" value={subtotal.pool} />
            <SummaryRow label="ロッカー 小計" value={subtotal.locker} />
            <SummaryRow label="トレーニングジム 小計" value={subtotal.gym} />
            <SummaryRow label="会員券 小計" value={subtotal.membership} />
            <SummaryRow label="回数券 小計" value={subtotal.coupon} />
            <div className="h-px bg-gray-200" />
            <div className="flex items-center justify-between text-base">
              <span className="font-semibold">合計</span>
              <YenMono value={total} className="text-lg font-bold" />
            </div>
          </div>
        </Section>

        <Section title="メモと注意事項">
          <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
            <li><strong>ロッカーについて：</strong>プール利用時は更衣室ロッカー（<YenMono value={LOCKER_PER_USE} />/個）が必要です。2〜3人での共有は可能ですが、着替えスペースの都合上、4人以上での共有はできません。</li>
            <li>障害者割引は本人分の入場料金・会員券が半額（10円未満切り捨て）。備品関係は通常料金。</li>
            <li>回数券は 1冊=11枚綴りの購入金額のみを計上します（何回分消費するかの減算管理は含みません）。</li>
            <li>会員の家族等の特殊区分は未対応です。</li>
          </ul>
        </Section>
      </div>

      <footer className="mt-8 text-xs text-gray-500">
        *非公式の参考試算用ツールです。最新の料金・条件は必ず施設の公式情報をご確認ください。
      </footer>
    </main>
  );
}