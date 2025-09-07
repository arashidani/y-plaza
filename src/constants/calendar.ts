export const AREA_CATEGORIES = ['pool', 'studio', 'gym'] as const
export type AreaCategory = (typeof AREA_CATEGORIES)[number]

export const CATEGORY_COLOR: Record<AreaCategory, string> = {
  pool: '#1E90FF',
  studio: '#8B5CF6',
  gym: '#10B981'
}

export const CLOSED_BACKGROUND_COLOR = '#6b7280aa'

export const HOLIDAY_RED = '#ef4444'
export const WEEKEND_BLUE = '#3b82f6'

// 休館理由の定数
export const CLOSED_REASONS = ['weekly', 'holiday', 'winter'] as const
export type ClosedReason = (typeof CLOSED_REASONS)[number]

export function isAreaCategory(v: unknown): v is AreaCategory {
  return (AREA_CATEGORIES as readonly string[]).includes(v as string)
}

export function getAreaCategoryColor(category: AreaCategory): string {
  return CATEGORY_COLOR[category]
}
