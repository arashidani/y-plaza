// 対象区分
export type Category =
  | 'adult'
  | 'companionAdult'
  | 'senior'
  | 'student'
  | 'preschooler'
  | 'under2'
  | 'poolUser'
  | 'membership'

// 各種サービス
export type ServiceType = 'pool' | 'gym' | 'locker' | 'membership' | 'ticketBook'

// 時間帯
export type TimeSlot = 'day' | 'evening'

// 割引タイプ
export type Coupon = 'none' | 'riloClub' | 'joymate' | 'saninActive' | 'disability'

// 営業期間（プールの季節区分）
export type Season = 'summer' | 'normal'

// 計算結果
export type CalcResult = { status: 'ok'; price: number } | { status: 'not_for_sale' }

export interface CalcInput {
  season: Season
  slot: TimeSlot
  category: Category
  coupon?: Coupon
}
