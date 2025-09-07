export const POLICY = {
  // 木曜定休
  weeklyClosedDay: 4 as const,
  summerOpen: {
    // 7月第3土曜から
    startRule: 'THIRD_SATURDAY_OF_JULY' as const,
    // 8/31 まで無休
    end: { month: 8, day: 31 }
  },
  winterClosed: {
    // 毎年 2/1 から 2 月最終日まで（閏年考慮: 翌月1日-1日）
    start: { month: 2, day: 1 },
    endRule: 'LAST_DAY_OF_FEBRUARY' as const
  }
} as const
