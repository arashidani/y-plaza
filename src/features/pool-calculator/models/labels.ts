import type { Category, Tariff, MembershipDuration } from './types';

export const CATEGORY_LABEL: Record<Category, string> = {
  adult: "大人",
  senior: "シルバー(65歳以上)",
  student: "小・中・高生",
  preschool3plus: "3歳以上(就学前)",
  under2: "2歳以下",
  companion_student_adult: "3歳〜高校生までと同伴の大人",
  companion_senior_adult: "シルバーと同伴の大人",
};

export const TARIFF_LABEL: Record<Tariff, string> = {
  season_9_6: "9〜6月",
  season_7_8: "7・8月",
  evening: "イブニング(17時以降)",
  group: "団体(20名以上)",
};

export const DURATION_LABEL: Record<MembershipDuration, string> = {
  "30d": "30日",
  "6m": "半年",
  "1y": "1年",
};