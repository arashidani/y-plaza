/**
 * 数値を2桁のゼロ埋め文字列に変換します。
 *
 * @param n - 変換対象の数値（例: 1 → '01'）
 * @returns 2桁ゼロ埋めされた文字列
 */
export function pad(n: number): string {
  return String(n).padStart(2, '0')
}

/**
 * Date をローカルタイムの年月日で切り出し、`YYYY-MM-DD` 形式の文字列に変換します。
 *
 * @param d - 対象の Date オブジェクト
 * @returns `YYYY-MM-DD` 形式の文字列（例: '2025-09-03'）
 */
export function toDateString(d: Date): string {
  const y = d.getFullYear()
  const m = pad(d.getMonth() + 1)
  const day = pad(d.getDate())
  return `${y}-${m}-${day}`
}
