import type { Tariff } from '../models/types'

/**
 * 現在の時刻と月に基づいてプールのデフォルトタリフを決定する
 * @returns デフォルトのタリフ
 */
export function getDefaultPoolTariff(): Tariff {
  const now = new Date()
  const month = now.getMonth() + 1
  const hour = now.getHours()

  // 17時以降21時までがイブニング
  if (hour >= 17 && hour <= 21) {
    return 'evening'
  }

  // 7,8月なら7-8月シーズン
  if (month === 7 || month === 8) {
    return 'season_7_8'
  }

  // 9,10,11,12,1,2,3,4,5,6月なら9-6月シーズン
  return 'season_9_6'
}