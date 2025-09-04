import { CalcInput, CalcResult } from './types'
import { getBasePrice } from './price-tables'
import { applyRiloClub, joymatePrice, applySaninActive } from './discounts'

// 10円未満切り捨て処理
const floorTo10 = (yen: number) => Math.floor(yen / 10) * 10

export function calcPrice(input: CalcInput): CalcResult {
  const { date, slot, category, coupon = 'none' } = input

  // 基本料金取得（販売なしは null）
  const base = getBasePrice(date, slot, category)
  if (base == null) return { status: 'not_for_sale' }

  // 割引適用
  switch (coupon) {
    case 'disability': {
      // 障害者割引
      if (base === 0) return { status: 'ok', price: 0 }
      return { status: 'ok', price: floorTo10(Math.floor(base / 2)) }
    }
    case 'riloClub': {
      const v = applyRiloClub(base, slot, category)
      if (v != null) return { status: 'ok', price: v }
      break
    }
    case 'joymate': {
      const v = joymatePrice(date, slot, category)
      if (v != null) return { status: 'ok', price: v }
      break
    }
    case 'saninActive': {
      const v = applySaninActive(date, slot, category, base)
      if (v != null) return { status: 'ok', price: v }
      break
    }
    case 'none':
    default:
      break
  }

  // 割引なし or 割引適用不可
  return { status: 'ok', price: base }
}
