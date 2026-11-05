import { ingredientById } from '../data/ingredients'
import { addDays, todayStr } from './dates'
import type { NewFridgeItem, NewShoppingItem } from './types'

/** 체험용 샘플 데이터 (오늘 기준 상대 날짜) */
export function demoItems(): NewFridgeItem[] {
  const t = todayStr()
  const mk = (id: string, qty: number, daysLeft: number, bought = -2): NewFridgeItem => {
    const ing = ingredientById(id)!
    return { name: ing.name, ingredientId: id, category: ing.category, qty, unit: ing.unit, storage: ing.defaultStorage, purchasedAt: addDays(t, bought), expiresAt: addDays(t, daysLeft) }
  }
  return [
    mk('milk', 900, 1), mk('pork', 300, 0, -1), mk('tofu', 1, 2), mk('bean_sprout', 200, 1), mk('spinach', 150, 3),
    mk('egg', 8, 12), mk('kimchi', 500, 40, -10), mk('onion', 3, 15), mk('green_onion', 2, 5), mk('garlic', 20, 25),
    mk('rice', 2000, 120, -30), mk('potato', 4, 18), mk('carrot', 2, 14), mk('cheese', 6, 20), mk('bread', 6, -1, -5),
    mk('ramen', 4, 100), mk('tuna_can', 2, 300), mk('yogurt', 3, 6), mk('apple', 4, 20), mk('fish_cake', 200, 4),
  ]
}
export function demoShopping(): NewShoppingItem[] {
  const mk = (id: string, qty: number): NewShoppingItem => { const ing = ingredientById(id)!; return { name: ing.name, ingredientId: id, qty, unit: ing.unit, done: false } }
  return [mk('zucchini', 1), mk('chicken', 500), mk('flour', 1)]
}
