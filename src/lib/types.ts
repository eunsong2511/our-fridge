import type { Category, Storage } from '../data/ingredients'

export interface FridgeItem {
  id: string
  name: string
  ingredientId?: string      // 카탈로그 매칭 결과 (없으면 사용자 정의 재료)
  category: Category
  qty: number
  unit: string
  storage: Storage
  purchasedAt: string        // YYYY-MM-DD
  expiresAt: string          // YYYY-MM-DD
  memo?: string
  createdAt: string
}

export interface ShoppingItem {
  id: string
  name: string
  ingredientId?: string
  qty: number
  unit: string
  done: boolean
  createdAt: string
}

export type NewFridgeItem = Omit<FridgeItem, 'id' | 'createdAt'>
export type NewShoppingItem = Omit<ShoppingItem, 'id' | 'createdAt'>

export interface Settings {
  alertDays: number          // D-n 이하이면 알림
  defaultServings: number
  notifyBrowser: boolean
  lastNotifiedOn?: string    // YYYY-MM-DD
}

export const DEFAULT_SETTINGS: Settings = { alertDays: 3, defaultServings: 2, notifyBrowser: false }
