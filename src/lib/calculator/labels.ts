import type { Coupon } from './types'

// i18nラベルはUI層の useCalculatorLabels で解決します。
// ここでは lib 層向けのキー集合のみを提供します。

export const ALL_COUPONS: Coupon[] = [
  'none',
  'riloClub',
  'joymate',
  'saninActive',
  'disability'
]
