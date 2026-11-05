import type { SupabaseClient } from '@supabase/supabase-js'
import type { FridgeItem, NewFridgeItem, NewShoppingItem, ShoppingItem } from '../types'
import type { Repo } from './types'

type ItemRow = {
  id: string; user_id: string; name: string; ingredient_id: string | null; category: string
  qty: number; unit: string; storage: string; purchased_at: string; expires_at: string; memo: string | null; created_at: string
}
type ShopRow = { id: string; user_id: string; name: string; ingredient_id: string | null; qty: number; unit: string; done: boolean; created_at: string }

const fromItem = (r: ItemRow): FridgeItem => ({
  id: r.id, name: r.name, ingredientId: r.ingredient_id ?? undefined, category: r.category as FridgeItem['category'],
  qty: Number(r.qty), unit: r.unit, storage: r.storage as FridgeItem['storage'],
  purchasedAt: r.purchased_at, expiresAt: r.expires_at, memo: r.memo ?? undefined, createdAt: r.created_at,
})
const toItem = (i: Partial<NewFridgeItem>) => {
  const o: Record<string, unknown> = {}
  if (i.name !== undefined) o.name = i.name
  if ('ingredientId' in i) o.ingredient_id = i.ingredientId ?? null
  if (i.category !== undefined) o.category = i.category
  if (i.qty !== undefined) o.qty = i.qty
  if (i.unit !== undefined) o.unit = i.unit
  if (i.storage !== undefined) o.storage = i.storage
  if (i.purchasedAt !== undefined) o.purchased_at = i.purchasedAt
  if (i.expiresAt !== undefined) o.expires_at = i.expiresAt
  if ('memo' in i) o.memo = i.memo ?? null
  return o
}
const fromShop = (r: ShopRow): ShoppingItem => ({
  id: r.id, name: r.name, ingredientId: r.ingredient_id ?? undefined, qty: Number(r.qty), unit: r.unit, done: r.done, createdAt: r.created_at,
})
const toShop = (i: Partial<NewShoppingItem>) => {
  const o: Record<string, unknown> = {}
  if (i.name !== undefined) o.name = i.name
  if ('ingredientId' in i) o.ingredient_id = i.ingredientId ?? null
  if (i.qty !== undefined) o.qty = i.qty
  if (i.unit !== undefined) o.unit = i.unit
  if (i.done !== undefined) o.done = i.done
  return o
}

export function makeSupabaseRepo(sb: SupabaseClient, userId: string): Repo {
  const throwIf = (e: { message: string } | null) => { if (e) throw new Error(e.message) }
  return {
    mode: 'cloud',
    async listItems() {
      const { data, error } = await sb.from('fridge_items').select('*').order('expires_at')
      throwIf(error); return (data as ItemRow[]).map(fromItem)
    },
    async addItem(item) {
      const { data, error } = await sb.from('fridge_items').insert({ ...toItem(item), user_id: userId }).select().single()
      throwIf(error); return fromItem(data as ItemRow)
    },
    async updateItem(id, patch) { const { error } = await sb.from('fridge_items').update(toItem(patch)).eq('id', id); throwIf(error) },
    async removeItem(id) { const { error } = await sb.from('fridge_items').delete().eq('id', id); throwIf(error) },
    async listShopping() {
      const { data, error } = await sb.from('shopping_items').select('*').order('created_at', { ascending: false })
      throwIf(error); return (data as ShopRow[]).map(fromShop)
    },
    async addShopping(item) {
      const { data, error } = await sb.from('shopping_items').insert({ ...toShop(item), user_id: userId }).select().single()
      throwIf(error); return fromShop(data as ShopRow)
    },
    async updateShopping(id, patch) { const { error } = await sb.from('shopping_items').update(toShop(patch)).eq('id', id); throwIf(error) },
    async removeShopping(id) { const { error } = await sb.from('shopping_items').delete().eq('id', id); throwIf(error) },
  }
}
