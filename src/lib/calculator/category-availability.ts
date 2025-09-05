import type { Category, ServiceType, Coupon } from './types'
import {
  membershipPrices,
  type MembershipCategory,
  type MembershipPeriod
} from './price-tables'

// サービス毎に選択可能な区分一覧（汎用セレクト用）
export function allowedCategoriesForService(
  serviceType: ServiceType
): Category[] {
  switch (serviceType) {
    case 'pool':
      return [
        'adult',
        'companionAdult',
        'senior',
        'student',
        'preschooler',
        'under2'
      ]
    case 'gym':
      // 一般のセレクトでは "会員・プール利用者" を除外（専用エディタで扱う）
      return ['adult', 'student']
    case 'ticketBook':
      return ['adult', 'senior', 'student', 'preschooler']
    case 'locker':
    case 'membership':
    default:
      return []
  }
}

// ジムエディタ専用の区分一覧
export function gymEditorCategories(): Category[] {
  return ['adult', 'student', 'poolUser']
}

// 既に使用している区分を除いた選択肢を返す（ただし現在アイテムの区分は含める）
export function availableCategoriesExcludingUsed(
  allowed: Category[],
  items: Array<{ id: string; category: Category }>,
  currentItemId: string
): Category[] {
  const used = items
    .filter((i) => i.id !== currentItemId)
    .map((i) => i.category)
  const current = items.find((i) => i.id === currentItemId)?.category
  const available = allowed.filter((c) => !used.includes(c))
  if (current && !available.includes(current)) available.push(current)
  return available
}

// 追加可否（ジム用）: 使用数 < 許可数
export function canAddGym(items: Array<{ category: Category }>): boolean {
  const usedCount = items.length
  const max = gymEditorCategories().length
  return usedCount < max
}

// 追加可否（プール用）: 区分数 × クーポン数（最大 N）
export function canAddPool(
  items: Array<{ category: Category }>,
  couponCount: number,
  maxTotal = 30
): boolean {
  const allowedCount = allowedCategoriesForService('pool').length
  const maxCombinations = allowedCount * couponCount
  return items.length < Math.min(maxCombinations, maxTotal)
}

export function defaultCategory(allowed: Category[]): Category {
  return allowed[0] || 'adult'
}

export function membershipCategoriesForPeriod(
  period: MembershipPeriod
): MembershipCategory[] {
  const available = membershipPrices[period]
  return Object.keys(available) as MembershipCategory[]
}

// 空いている (category, coupon) の組み合わせを先頭から探す
export function findFirstAvailablePoolCombo(
  existing: Array<{ category: Category; coupon: Coupon }>,
  categories: Category[],
  coupons: Coupon[]
): { category: Category; coupon: Coupon } | null {
  // 重複チェックのためセットを作成
  const used = new Set(existing.map((i) => `${i.category}|${i.coupon}`))
  for (const c of coupons) {
    for (const cat of categories) {
      if (!used.has(`${cat}|${c}`)) return { category: cat, coupon: c }
    }
  }
  return null
}
