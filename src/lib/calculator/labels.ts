import type { ServiceType, Category, TimeSlot, Coupon, Season } from './types'
import type { MembershipCategory, MembershipPeriod } from './price-tables'

// サービスタイプラベル
export const serviceTypeLabels: Record<ServiceType, string> = {
  pool: 'プール',
  gym: 'トレーニングジム',
  locker: 'ロッカー',
  membership: '会員制',
  ticketBook: '回数券(11枚綴り)'
}

// カテゴリのラベル
export const categoryLabels: Record<Category, string> = {
  adult: '大人',
  companionAdult: '同伴者大人',
  senior: 'シルバー(65歳以上)',
  student: '小・中・高生',
  preschooler: '3歳以上(就学前)',
  under2: '2歳以下',
  poolUser: '会員・プール利用者',
  membership: '会員'
}

// ジム用表示ラベル（未使用カテゴリは空）
export const gymCategoryLabels: Record<Category, string> = {
  adult: '大人',
  student: '小・中・高生',
  poolUser: '会員・プール利用者',
  companionAdult: '',
  senior: '',
  preschooler: '',
  under2: '',
  membership: ''
}

// 時間帯のラベル
export const timeSlotLabels: Record<TimeSlot, string> = {
  day: '日中料金(開館〜午後5時)',
  evening: 'イブニング料金(午後5時以降)'
}

// 季節のラベル
export const seasonLabels: Record<Season, string> = {
  normal: '通常営業(9〜6月)',
  summer: '夏季営業(7・8月)'
}

// 割引のラベル
export const couponLabels = {
  none: 'なし',
  riloClub: 'リロクラブ',
  joymate: 'ジョイメイトしまね',
  saninActive: '山陰アクティブクラブ',
  disability: '障害者割引'
} as const

// 会員制期間のラベル
export const membershipPeriodLabels: Record<MembershipPeriod, string> = {
  '30days': '30日',
  halfYear: '半年',
  '1year': '1年'
}

// 会員制区分のラベル
export const membershipCategoryLabels: Record<MembershipCategory, string> = {
  adult: '大人',
  senior: 'シルバー(65歳以上)',
  student: '小・中・高生',
  family: '家族',
  corporate: '法人'
}

// 各種サービスラベル取得ヘルパー関数
export function getServiceTypeLabel(type: ServiceType): string {
  return serviceTypeLabels[type]
}

// 各種カテゴリラベル取得ヘルパー関数
export function getCategoryLabel(category: Category): string {
  return categoryLabels[category]
}

// 各種ジムラベル取得ヘルパー関数
export function getGymCategoryLabel(category: Category): string {
  return gymCategoryLabels[category]
}
// 各種クーポンラベル取得ヘルパー関数
export function getCouponLabel(coupon: Coupon): string {
  return couponLabels[coupon]
}

// 時間帯ラベル取得ヘルパー関数
export function getTimeSlotLabel(slot: TimeSlot): string {
  return timeSlotLabels[slot]
}

// 季節ラベル取得ヘルパー関数
export function getSeasonLabel(season: Season): string {
  return seasonLabels[season]
}

// 会員制の期間ラベル取得ヘルパー関数
export function getMembershipPeriodLabel(period: MembershipPeriod): string {
  return membershipPeriodLabels[period]
}

// 会員制の区分ラベル取得ヘルパー関数
export function getMembershipCategoryLabel(category: MembershipCategory): string {
  return membershipCategoryLabels[category]
}
