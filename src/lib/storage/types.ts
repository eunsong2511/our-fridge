import type { FridgeItem, NewFridgeItem, NewShoppingItem, ShoppingItem } from '../types'

export interface Repo {
  mode: 'local' | 'cloud'
  listItems(): Promise<FridgeItem[]>
  addItem(item: NewFridgeItem): Promise<FridgeItem>
  updateItem(id: string, patch: Partial<NewFridgeItem>): Promise<void>
  removeItem(id: string): Promise<void>
  listShopping(): Promise<ShoppingItem[]>
  addShopping(item: NewShoppingItem): Promise<ShoppingItem>
  updateShopping(id: string, patch: Partial<NewShoppingItem>): Promise<void>
  removeShopping(id: string): Promise<void>
}

export const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`)
