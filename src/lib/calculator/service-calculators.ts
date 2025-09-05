import { calcPrice } from './calc'
import { Category, Coupon, TimeSlot, Season } from './types'
import {
  gymPrices,
  ticketBookPrices,
  membershipPrices,
  MembershipPeriod,
  MembershipCategory
} from './price-tables'

/**
 * サービス毎の計算処理をまとめた関数群
 */

// 詳細行（i18n対応のための構造化データ）
export type PoolDetailItem =
  | {
      service: 'pool'
      status: 'ok'
      category: Category
      quantity: number
      coupon: Coupon | 'none'
      unitPrice: number
      lineTotal: number
    }
  | {
      service: 'pool'
      status: 'not_for_sale'
      category: Category
    }

export type GymDetailItem = {
  service: 'gym'
  category: Category
  quantity: number
  unitPrice: number
  lineTotal: number
}

/**
 * プール利用の合計金額と明細を計算します。
 * @param items 対象者の配列（区分・人数・クーポン）
 * @param season 営業期間（通常/夏季）
 * @param slot 時間帯（昼/夕）
 * @returns 合計金額と、行ごとの明細文字列配列
 */
export function calculatePool(
  items: Array<{ category: Category; quantity: number; coupon: Coupon }>,
  season: Season,
  slot: TimeSlot
) {
  let total = 0
  const details: string[] = []
  const itemsStructured: PoolDetailItem[] = []

  items.forEach((item) => {
    const result = calcPrice({
      season,
      slot,
      category: item.category,
      coupon: item.coupon
    })
    if (result.status === 'ok') {
      const itemTotal = result.price * item.quantity
      total += itemTotal
      // details は i18n のためUI側で生成するため未使用
      itemsStructured.push({
        service: 'pool',
        status: 'ok',
        category: item.category,
        quantity: item.quantity,
        coupon: item.coupon,
        unitPrice: result.price,
        lineTotal: itemTotal
      })
    } else {
      // details は i18n のためUI側で生成するため未使用
      itemsStructured.push({
        service: 'pool',
        status: 'not_for_sale',
        category: item.category
      })
    }
  })

  return { total, details, items: itemsStructured }
}

/**
 * ジム利用の合計金額と明細を計算します。
 * @param items 対象者の配列（区分・人数）
 * @returns 合計金額と、行ごとの明細文字列配列
 */
export function calculateGym(
  items: Array<{ category: Category; quantity: number }>
) {
  let total = 0
  const details: string[] = []
  const itemsStructured: GymDetailItem[] = []

  items.forEach((item) => {
    const unitPrice =
      item.category === 'poolUser' ? 0 : gymPrices[item.category] || 0
    const itemTotal = unitPrice * item.quantity
    total += itemTotal
    // details は i18n のためUI側で生成するため未使用
    itemsStructured.push({
      service: 'gym',
      category: item.category,
      quantity: item.quantity,
      unitPrice,
      lineTotal: itemTotal
    })
  })

  return { total, details, items: itemsStructured }
}

/**
 * ロッカー利用の料金を計算します。
 * @param quantity ロッカー個数
 * @returns 合計金額と表示用メッセージ
 */
export function calculateLocker(quantity: number) {
  const total = 100 * quantity
  return { total }
}

/**
 * 回数券の料金を計算します。
 * @param category 区分
 * @returns 合計金額と表示用メッセージ（販売なしの場合はその旨の文言）
 */
export function calculateTicketBook(category: Category) {
  const price = ticketBookPrices[category]
  if (price !== undefined) {
    return { total: price, available: true as const }
  }
  return { total: 0, available: false as const }
}

/**
 * 会員料金を計算します。
 * @param period 期間（30日/半年/1年）の3択
 * @param category 会員区分
 * @returns 合計金額と表示用メッセージ（販売なしの場合はその旨の文言）
 */
export function calculateMembership(
  period: MembershipPeriod,
  category: MembershipCategory
) {
  const price = membershipPrices[period][category]
  if (price !== undefined) {
    return { total: price, available: true as const }
  }
  return { total: 0, available: false as const }
}
