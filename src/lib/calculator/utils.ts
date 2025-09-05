/**
 * 単純なユニークIDを生成します（プレフィックス付き）。
 * フロントエンドの一時キー用途を想定。
 */
export function uniqueId(prefix = 'id'): string {
  const rand = Math.random().toString(36).slice(2, 8)
  return `${prefix}-${Date.now()}-${rand}`
}

/**
 * i18n対応の通貨フォーマッタ。
 * コンポーネント内で翻訳関数が利用可能な場合に使用。
 */
export function formatCurrencyWithI18n(
  value: number,
  t: (key: string) => string
): string {
  return `${value.toLocaleString('ja-JP')} ${t('monetary.unit')}`
}
