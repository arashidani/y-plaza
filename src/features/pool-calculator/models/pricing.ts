import type { Category, Tariff, MembershipDuration, MembershipCategory } from './types';

const Y = (n: number) => n; // 金額は税込整数円

export const POOL_PRICES: Record<Tariff, Partial<Record<Category, number>>> = {
  season_9_6: {
    adult: Y(830),
    senior: Y(620),
    student: Y(410),
    preschool3plus: Y(310),
    under2: Y(0),
    companion_student_adult: Y(620),
    companion_senior_adult: Y(620),
  },
  season_7_8: {
    adult: Y(1120),
    senior: Y(710),
    student: Y(500),
    preschool3plus: Y(400),
    under2: Y(0),
    companion_student_adult: Y(830),
    companion_senior_adult: Y(830),
  },
  evening: {
    adult: Y(620),
    senior: Y(520),
    student: Y(310),
    preschool3plus: Y(0), // 無料
    under2: Y(0),
    // 同伴大人の設定は資料に無いため適用不可とする
  },
  group: {
    adult: Y(730),
    senior: Y(520),
    student: Y(310),
    preschool3plus: Y(200),
    under2: Y(0),
  },
};

export const COUPON_BOOK = {
  // 回数券（11枚綴）
  adult: Y(8380),
  senior: Y(6280),
  student: Y(4190),
  preschool3plus: Y(2090),
};

export const LOCKER_PER_USE = Y(100);

export const GYM_PRICES = {
  adult: Y(200),
  student: Y(100),
  member_or_pool_user: Y(0),
};

export const MEMBERSHIP_PRICES: Record<MembershipDuration, Partial<Record<MembershipCategory, number>>> = {
  "30d": {
    adult: Y(2610),
    senior: Y(2080),
    // student: なし
  },
  "6m": {
    adult: Y(12570),
    senior: Y(9420),
    student: Y(6280),
    // 家族・法人は個別運用のため未実装
  },
  "1y": {
    adult: Y(20950),
    senior: Y(15710),
    student: Y(10470),
  },
};