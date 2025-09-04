import { Category, TimeSlot } from './types'

// 夏季営業(7月,8月)かどうか
export const isSummer = (d: Date) => {
  // 1-12
  const m = d.getMonth() + 1
  return m === 7 || m === 8
}


// 基本料金（プール）
const baseDayNormal: Record<Category, number | undefined> = {
  adult: 830,
  companionAdult: 620,
  senior: 620,
  student: 410,
  preschooler: 310,
  under2: 0,
  poolUser: undefined,
  membership: undefined
}

// 夏季料金（プール）
const baseDaySummer: Record<Category, number | undefined> = {
  adult: 1120,
  companionAdult: 830,
  senior: 710,
  student: 500,
  preschooler: 400,
  under2: 0,
  poolUser: undefined,
  membership: undefined
}

// イブニング料金はcompanionAdult を持たない点に注意（プール）
export const baseEvening: Partial<Record<Category, number>> = {
  adult: 620,
  senior: 520,
  student: 310,
  preschooler: 0,
  under2: 0
}

// トレーニングジム料金
export const gymPrices: Partial<Record<Category, number>> = {
  adult: 200,
  student: 100
  // companionAdult, senior, preschooler, under2 は販売なし
  // 会員・プール利用者は無料
}

// 回数券料金
export const ticketBookPrices: Partial<Record<Category, number>> = {
  adult: 8380,
  senior: 6280,
  student: 4190,
  preschooler: 2090
  // companionAdult, under2 は販売なし
}

// 会員制料金
export type MembershipPeriod = '30days' | 'halfYear' | '1year'
export type MembershipCategory = 'adult' | 'senior' | 'student' | 'family' | 'corporate'

export const membershipPrices: Record<
  MembershipPeriod,
  Partial<Record<MembershipCategory, number>>
> = {
  '30days': {
    adult: 2610,
    senior: 2080
  },
  halfYear: {
    adult: 12570,
    senior: 9420,
    student: 6280
  },
  '1year': {
    adult: 20950,
    senior: 15710,
    student: 10470,
    family: 31420,
    corporate: 52380
  }
}

export function getBasePrice(date: Date, slot: TimeSlot, category: Category): number | null {
  if (slot === 'day') {
    const tbl = isSummer(date) ? baseDaySummer : baseDayNormal
    return tbl[category] ?? null
  }
  // evening
  // 販売なし
  if (category === 'companionAdult') return null
  return baseEvening[category] ?? null
}
