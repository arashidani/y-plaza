import { Category, TimeSlot, Season } from './types'

// リロクラブ: adult/senior の Day に 300円引き
export function applyRiloClub(
  base: number,
  slot: TimeSlot,
  category: Category
): number | null {
  if (slot !== 'day') return null
  if (category !== 'adult' && category !== 'senior') return null
  return Math.max(0, base - 300)
}

// ジョイメイト
export function joymatePrice(
  season: Season,
  slot: TimeSlot,
  category: Category
): number | null {
  if (slot !== 'day') return null

  if (season === 'summer') {
    // 夏季 Day
    const summerMap: Partial<Record<Category, number>> = {
      adult: 920,
      companionAdult: 630,
      senior: 510,
      student: 300,
      preschooler: 300
    }
    const v = summerMap[category]
    return typeof v === 'number' ? v : null
  } else {
    // 通常期 Day
    const normalMap: Partial<Record<Category, number>> = {
      adult: 610,
      senior: 510,
      student: 300,
      preschooler: 210
    }
    const v = normalMap[category]
    return typeof v === 'number' ? v : null
  }
}

// 山陰アクティブクラブ: 6–9月、Day、student/preschooler のみ 200円引き
export function applySaninActive(
  season: Season,
  slot: TimeSlot,
  category: Category,
  base: number
): number | null {
  // 6–9月相当は、季節フラグで 'summer' のときのみ適用とする
  if (season !== 'summer') return null
  if (slot !== 'day') return null
  if (category !== 'student' && category !== 'preschooler') return null
  return Math.max(0, base - 200)
}
