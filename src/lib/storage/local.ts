import type { FridgeItem, NewFridgeItem, NewShoppingItem, ShoppingItem } from '../types'
import { uid, type Repo } from './types'

const K_ITEMS = 'fridge.items.v1'
const K_SHOP = 'fridge.shopping.v1'

function read<T>(key: string): T[] {
  try { return JSON.parse(localStorage.getItem(key) ?? '[]') as T[] } catch { return [] }
}
function write<T>(key: string, v: T[]) {
  try { localStorage.setItem(key, JSON.stringify(v)) } catch { /* ignore */ }
}

export const localRepo: Repo = {
  mode: 'local',
  async listItems() { return read<FridgeItem>(K_ITEMS) },
  async addItem(item: NewFridgeItem) {
    const row: FridgeItem = { ...item, id: uid(), createdAt: new Date().toISOString() }
    write(K_ITEMS, [row, ...read<FridgeItem>(K_ITEMS)])
    return row
  },
  async updateItem(id, patch) {
    write(K_ITEMS, read<FridgeItem>(K_ITEMS).map((i) => (i.id === id ? { ...i, ...patch } : i)))
  },
  async removeItem(id) { write(K_ITEMS, read<FridgeItem>(K_ITEMS).filter((i) => i.id !== id)) },
  async listShopping() { return read<ShoppingItem>(K_SHOP) },
  async addShopping(item: NewShoppingItem) {
    const row: ShoppingItem = { ...item, id: uid(), createdAt: new Date().toISOString() }
    write(K_SHOP, [row, ...read<ShoppingItem>(K_SHOP)])
    return row
  },
  async updateShopping(id, patch) {
    write(K_SHOP, read<ShoppingItem>(K_SHOP).map((i) => (i.id === id ? { ...i, ...patch } : i)))
  },
  async removeShopping(id) { write(K_SHOP, read<ShoppingItem>(K_SHOP).filter((i) => i.id !== id)) },
}
