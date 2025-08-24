import type { Category, Tariff, MembershipDuration, MembershipCategory, Line } from '../models/types'
import { POOL_PRICES, MEMBERSHIP_PRICES, LOCKER_PER_USE, GYM_PRICES, COUPON_BOOK } from '../models/pricing'

export function yen(n: number): string {
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(n)
}

export function isTariffAvailableForCategory(tariff: Tariff, cat: Category): boolean {
  // 同伴大人は資料にイブニング料金の記載がないため、イブニングは不可
  if (tariff === 'evening' && (cat === 'companion_student_adult' || cat === 'companion_senior_adult')) {
    return false
  }
  return POOL_PRICES[tariff][cat] !== undefined
}

export function poolEntryUnitPrice(tariff: Tariff, cat: Category, disabledDiscount: boolean): number {
  const base = POOL_PRICES[tariff][cat]
  if (base == null) return NaN
  // 障害者割引: 入場料金・会員券が半額（10円未満切り捨て）
  return disabledDiscount ? Math.floor((base / 2) / 10) * 10 : base
}

export function membershipUnitPrice(dur: MembershipDuration, cat: MembershipCategory, disabledDiscount: boolean): number {
  const base = MEMBERSHIP_PRICES[dur][cat]
  if (base == null) return NaN
  return disabledDiscount ? Math.floor((base / 2) / 10) * 10 : base
}

export function calcLineTotal(line: Line): number {
  switch (line.type) {
    case 'pool': {
      let totalPoolCost = 0
      
      line.entries.forEach(entry => {
        const unit = poolEntryUnitPrice(line.tariff, entry.category, entry.disabledDiscount)
        if (Number.isFinite(unit)) {
          totalPoolCost += unit * entry.count
        }
      })
      
      // プール利用料のみ（ロッカー代は別途明示的に追加）
      return totalPoolCost
    }
    case 'gym': {
      const unit =
        line.who === 'member_or_pool_user' ? GYM_PRICES.member_or_pool_user : line.who === 'adult' ? GYM_PRICES.adult : GYM_PRICES.student
      return unit * line.count
    }
    case 'locker': {
      return LOCKER_PER_USE * line.count
    }
    case 'membership': {
      const unit = membershipUnitPrice(line.duration, line.category, line.disabledDiscount)
      if (!Number.isFinite(unit)) return 0
      return unit * line.count
    }
    case 'coupon': {
      const unit = COUPON_BOOK[line.category]
      return (unit ?? 0) * line.books
    }
  }
}