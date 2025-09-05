import type { Category, Coupon } from '@/lib/calculator/types'

export type GymItem = {
  id: string
  category: Category
  quantity: number
}

export type PoolItem = {
  id: string
  category: Category
  quantity: number
  coupon: Coupon
}

