import { calcPrice } from './calc'
import { Category, Coupon, TimeSlot, Season } from './types'
import {
  gymPrices,
  ticketBookPrices,
  membershipPrices,
  MembershipPeriod,
  MembershipCategory
} from './price-tables'
import { formatYen } from './utils'
import { couponLabels, getCategoryLabel, getGymCategoryLabel } from './labels'

/**
 * サービス毎の計算処理をまとめた関数群
 */

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
      const tag =
        item.coupon !== 'none' ? ` (${couponLabels[item.coupon]})` : ''
      details.push(
        `${getCategoryLabel(item.category)} ${item.quantity}名${tag}: ${formatYen(itemTotal)}`
      )
    } else {
      details.push(`${getCategoryLabel(item.category)}: 販売なし`)
    }
  })

  return { total, details }
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

  items.forEach((item) => {
    if (item.category === 'poolUser') {
      details.push(
        `${getGymCategoryLabel(item.category)} ${item.quantity}名: 0円`
      )
    } else {
      const unitPrice = gymPrices[item.category] || 0
      const itemTotal = unitPrice * item.quantity
      total += itemTotal
      details.push(
        `${getGymCategoryLabel(item.category)} ${item.quantity}名: ${formatYen(itemTotal)}`
      )
    }
  })

  return { total, details }
}

/**
 * ロッカー利用の料金を計算します。
 * @param quantity ロッカー個数
 * @returns 合計金額と表示用メッセージ
 */
export function calculateLocker(quantity: number) {
  const total = 100 * quantity
  return { total, message: `料金: ${formatYen(total)}` }
}

/**
 * 回数券の料金を計算します。
 * @param category 区分
 * @returns 合計金額と表示用メッセージ（販売なしの場合はその旨の文言）
 */
export function calculateTicketBook(category: Category) {
  const price = ticketBookPrices[category]
  if (price !== undefined) {
    return { total: price, message: `料金: ${formatYen(price)}` }
  }
  return { total: 0, message: 'この組み合わせでは販売されていません' }
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
    return { total: price, message: `料金: ${formatYen(price)}` }
  }
  return { total: 0, message: 'この組み合わせでは販売されていません' }
}
