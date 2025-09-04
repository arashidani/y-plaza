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

// 計算結果
export type CalcResult = { status: 'ok'; price: number } | { status: 'not_for_sale' }

export interface CalcInput {
  date: Date
  slot: TimeSlot
  category: Category
  coupon?: Coupon
}
