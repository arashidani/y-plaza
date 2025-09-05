import type { Category, Coupon } from './types'

/**
 * category, couponの重複を検出（同一IDは除外）
 */
export function isDuplicatePoolCombo(
  items: Array<{ id: string; category: Category; coupon: Coupon }>,
  currentId: string,
  category: Category,
  coupon: Coupon
): boolean {
  return items.some((i) => i.id !== currentId && i.category === category && i.coupon === coupon)
}

/**
 * 指定行に対して、同じcategoryで未使用のクーポンを先頭から探す
 */
export function findAlternativeCouponForCategory(
  items: Array<{ id: string; category: Category; coupon: Coupon }>,
  currentId: string,
  category: Category,
  allCoupons: Coupon[]
): Coupon | null {
  const used = new Set(
    items.filter((i) => i.id !== currentId && i.category === category).map((i) => i.coupon)
  )
  const alt = allCoupons.find((c) => !used.has(c))
  return alt ?? null
}

/**
 * 指定行における選択可能なクーポン一覧を返す
 */
export function availableCouponsForItem(
  items: Array<{ id: string; category: Category; coupon: Coupon }>,
  id: string,
  allCoupons: Coupon[]
): Coupon[] {
  const current = items.find((i) => i.id === id)
  if (!current) return allCoupons
  const used = new Set(
    items.filter((i) => i.id !== id && i.category === current.category).map((i) => i.coupon)
  )
  return allCoupons.filter((c) => !used.has(c))
}
