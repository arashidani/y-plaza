/**
 * 単純なユニークIDを生成します（プレフィックス付き）。
 * フロントエンドの一時キー用途を想定。
 */
export function uniqueId(prefix = 'id'): string {
  const rand = Math.random().toString(36).slice(2, 8)
  return `${prefix}-${Date.now()}-${rand}`
}

/**
 * 円表記の簡易フォーマッタ（3桁区切り + 円）。
 * 画面内の文言用途向け。数値表示はYenMonoを使うこと。
 */
export function formatYen(value: number): string {
  return `${value.toLocaleString('ja-JP')}円`
}
