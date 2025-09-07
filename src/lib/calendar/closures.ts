import { POLICY } from '@/data/policy'
import { getHolidayDateSet } from '@/data/holidays'
import { type ClosedReason } from '@/constants/calendar'
import { toDateString } from '@/lib/date-utils'

// その年の7月第3土曜を返す
export function thirdSaturdayOfJuly(year: number): Date {
  const july1 = new Date(year, 6, 1)
  const dow = july1.getDay()
  const firstSaturdayDate = 1 + ((6 - dow + 7) % 7)
  const thirdSaturdayDate = firstSaturdayDate + 14
  return new Date(year, 6, thirdSaturdayDate)
}

export function isWithinSummerOpen(d: Date): boolean {
  const y = d.getFullYear()
  const start = thirdSaturdayOfJuly(y)
  const endMonth = POLICY.summerOpen.end.month - 1
  const endDay = POLICY.summerOpen.end.day
  const end = new Date(y, endMonth, endDay)
  return d >= start && d <= end
}

export function isWithinWinterClosed(d: Date): boolean {
  const y = d.getFullYear()
  const startMonth = POLICY.winterClosed.start.month - 1
  const startDay = POLICY.winterClosed.start.day
  const start = new Date(y, startMonth, startDay)
  // 翌月1日の0日目 = 当月最終日（閏年対応）
  const end = new Date(y, startMonth + 1, 0)
  return d >= start && d <= end
}

export type CloseCheckResult = {
  closed: boolean
  reason?: ClosedReason
}

export function isClosedByPolicy(d: Date): CloseCheckResult {
  // 夏季無休は常に開館
  if (isWithinSummerOpen(d)) return { closed: false }

  const dow = d.getDay()
  const weekly = POLICY.weeklyClosedDay
  const holidays = getHolidayDateSet(d.getFullYear())
  const ds = toDateString(d)
  const isHoliday = holidays.has(ds)

  // 冬季休業（2/1〜2月最終日）は完全に閉館（祝日でも閉館）
  if (isWithinWinterClosed(d)) return { closed: true, reason: 'winter' }

  // 祝日は開館。週休と重なっても祝日が優先（開館）。
  if (isHoliday) return { closed: false }

  // 通常の週休（祝日ではない木曜）
  if (dow === weekly) return { closed: true, reason: 'weekly' }

  return { closed: false }
}

// 指定年の全日について休館日を返す（夏季無休・祝日例外考慮）
export function listClosedDateStringsOfYear(year: number): string[] {
  const start = new Date(year, 0, 1)
  const end = new Date(year, 11, 31)
  const list: string[] = []
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const r = isClosedByPolicy(d)
    if (r.closed) list.push(toDateString(d))
  }
  return list
}
