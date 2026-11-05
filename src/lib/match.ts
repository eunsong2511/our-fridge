import { RECIPES, type Recipe, type RecipeIngredient } from '../data/recipes'
import { INGREDIENTS, ingredientById } from '../data/ingredients'
import type { FridgeItem } from './types'
import { daysLeft } from './dates'

export interface IngredientLine extends RecipeIngredient {
  name: string
  scaled: number          // n인분 환산량
  have: boolean
  haveQty?: number        // 보유량 (단위 동일할 때만 의미)
  haveUnit?: string
  enough?: boolean        // 단위 동일 시 충분 여부
  expiring?: boolean      // 임박 재료 사용
  fridgeItemIds: string[]
}

export interface RecipeMatch {
  recipe: Recipe
  servings: number
  required: IngredientLine[]   // 필수 주재료
  optional: IngredientLine[]   // 선택 주재료
  seasonings: IngredientLine[]
  haveCount: number
  requiredCount: number
  missing: IngredientLine[]    // 부족한 필수 재료
  score: number                // 0~100
  usesExpiring: number         // 임박 재료 개수
}

const fmt = (n: number) => {
  if (Number.isInteger(n)) return String(n)
  const r = Math.round(n * 10) / 10
  return String(r)
}
export const fmtAmount = (n: number, unit: string) => `${fmt(n)}${unit}`

type Have = Map<string, FridgeItem[]>   // ingredientId → items (유통기한 임박순)

export function buildHaveMap(items: FridgeItem[]): Have {
  const m: Have = new Map()
  for (const it of items) {
    if (!it.ingredientId) continue
    if (daysLeft(it.expiresAt) < -1) continue   // 이틀 이상 지난 건 제외
    const arr = m.get(it.ingredientId) ?? []
    arr.push(it)
    m.set(it.ingredientId, arr)
  }
  for (const arr of m.values()) arr.sort((a, b) => a.expiresAt.localeCompare(b.expiresAt))
  return m
}

function toLine(ri: RecipeIngredient, servings: number, have: Have, alertDays: number): IngredientLine {
  const items = have.get(ri.id) ?? []
  const name = ingredientById(ri.id)?.name ?? ri.id
  const scaled = ri.amount * servings
  const sameUnit = items.filter((i) => i.unit === ri.unit)
  const haveQty = sameUnit.length ? sameUnit.reduce((s, i) => s + i.qty, 0) : undefined
  return {
    ...ri, name, scaled,
    have: items.length > 0,
    haveQty, haveUnit: items[0]?.unit,
    enough: haveQty === undefined ? undefined : haveQty >= scaled,
    expiring: items.some((i) => daysLeft(i.expiresAt) <= alertDays),
    fridgeItemIds: items.map((i) => i.id),
  }
}

export function matchRecipe(recipe: Recipe, items: FridgeItem[], servings: number, alertDays = 3, have = buildHaveMap(items)): RecipeMatch {
  const required = recipe.ingredients.filter((i) => !i.optional).map((i) => toLine(i, servings, have, alertDays))
  const optional = recipe.ingredients.filter((i) => i.optional).map((i) => toLine(i, servings, have, alertDays))
  const seasonings = recipe.seasonings.map((i) => toLine(i, servings, have, alertDays))
  const haveCount = required.filter((l) => l.have).length
  const missing = required.filter((l) => !l.have)
  const optHave = optional.filter((l) => l.have).length
  const base = required.length ? haveCount / required.length : 1
  const bonus = optional.length ? (optHave / optional.length) * 0.1 : 0
  const usesExpiring = [...required, ...optional].filter((l) => l.have && l.expiring).length
  const score = Math.round(Math.min(1, base * 0.9 + bonus) * 100)
  return { recipe, servings, required, optional, seasonings, haveCount, requiredCount: required.length, missing, score, usesExpiring }
}

export function rankRecipes(items: FridgeItem[], servings: number, alertDays = 3): RecipeMatch[] {
  const have = buildHaveMap(items)
  return RECIPES.map((r) => matchRecipe(r, items, servings, alertDays, have))
    .sort((a, b) => {
      const ka = a.missing.length === 0 ? 1 : 0, kb = b.missing.length === 0 ? 1 : 0
      if (ka !== kb) return kb - ka
      if (a.usesExpiring !== b.usesExpiring) return b.usesExpiring - a.usesExpiring
      if (a.score !== b.score) return b.score - a.score
      return a.missing.length - b.missing.length
    })
}

export interface Suggestion {
  ingredientId: string
  name: string
  unlocks: string[]   // 이 재료만 사면 완성되는 요리 이름
  nearly: string[]    // 이 재료 포함 2개 부족한 요리
  reason: 'unlock' | 'staple'
}

/** 식재료 추천: 하나만 더 사면 만들 수 있는 요리가 많은 재료 + 떨어진 상비 재료 */
export function suggestIngredients(items: FridgeItem[], limit = 8): Suggestion[] {
  const have = buildHaveMap(items)
  const map = new Map<string, Suggestion>()
  for (const r of RECIPES) {
    const missing = r.ingredients.filter((i) => !i.optional && !have.has(i.id))
    if (missing.length === 0 || missing.length > 2) continue
    for (const m of missing) {
      const s = map.get(m.id) ?? { ingredientId: m.id, name: ingredientById(m.id)?.name ?? m.id, unlocks: [], nearly: [], reason: 'unlock' as const }
      if (missing.length === 1) s.unlocks.push(r.name)
      else s.nearly.push(r.name)
      map.set(m.id, s)
    }
  }
  const unlocks = [...map.values()]
    .filter((s) => s.unlocks.length > 0 || s.nearly.length >= 2)
    .sort((a, b) => b.unlocks.length - a.unlocks.length || b.nearly.length - a.nearly.length)
  const staples = INGREDIENTS.filter((i) => i.staple && !have.has(i.id) && !map.has(i.id))
    .map((i): Suggestion => ({ ingredientId: i.id, name: i.name, unlocks: [], nearly: [], reason: 'staple' }))
  return [...unlocks, ...staples].slice(0, limit)
}
