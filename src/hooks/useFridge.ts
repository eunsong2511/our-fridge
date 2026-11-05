import { useCallback, useEffect, useState } from 'react'
import type { Repo } from '../lib/storage/types'
import type { FridgeItem, NewFridgeItem, NewShoppingItem, ShoppingItem } from '../lib/types'
import { ingredientById, resolveIngredientId } from '../data/ingredients'
import { addDays, todayStr } from '../lib/dates'

export interface Usage { ingredientId: string; qty: number; unit: string }

export function useFridge(repo: Repo) {
  const [items, setItems] = useState<FridgeItem[]>([])
  const [shopping, setShopping] = useState<ShoppingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    try {
      setError(null)
      const [a, b] = await Promise.all([repo.listItems(), repo.listShopping()])
      setItems(a); setShopping(b)
    } catch (e) { setError((e as Error).message) } finally { setLoading(false) }
  }, [repo])

  useEffect(() => { void reload() }, [reload])

  const run = async <T,>(fn: () => Promise<T>): Promise<T | undefined> => {
    try { return await fn() } catch (e) { setError((e as Error).message); await reload(); return undefined }
  }

  const addItem = (n: NewFridgeItem) => run(async () => {
    const row = await repo.addItem(n)
    setItems((xs) => [row, ...xs]); return row
  })
  const updateItem = (id: string, patch: Partial<NewFridgeItem>) => run(async () => {
    setItems((xs) => xs.map((i) => (i.id === id ? { ...i, ...patch } : i)))
    await repo.updateItem(id, patch)
  })
  const removeItem = (id: string) => run(async () => {
    setItems((xs) => xs.filter((i) => i.id !== id))
    await repo.removeItem(id)
  })

  const addShopping = (n: NewShoppingItem) => run(async () => {
    const row = await repo.addShopping(n)
    setShopping((xs) => [row, ...xs]); return row
  })
  const updateShopping = (id: string, patch: Partial<NewShoppingItem>) => run(async () => {
    setShopping((xs) => xs.map((i) => (i.id === id ? { ...i, ...patch } : i)))
    await repo.updateShopping(id, patch)
  })
  const removeShopping = (id: string) => run(async () => {
    setShopping((xs) => xs.filter((i) => i.id !== id))
    await repo.removeShopping(id)
  })

  /** 장보기 항목 → 냉장고로 이동 (카탈로그 기본값으로 유통기한 자동 계산) */
  const purchase = (shop: ShoppingItem[]) => run(async () => {
    const today = todayStr()
    for (const s of shop) {
      const ingId = s.ingredientId ?? resolveIngredientId(s.name)
      const ing = ingId ? ingredientById(ingId) : undefined
      const storage = ing?.defaultStorage ?? '냉장'
      const shelf = ing?.shelf[storage] ?? 7
      const row = await repo.addItem({
        name: s.name, ingredientId: ingId, category: ing?.category ?? '기타', qty: s.qty, unit: s.unit,
        storage, purchasedAt: today, expiresAt: addDays(today, shelf),
      })
      setItems((xs) => [row, ...xs])
      await repo.removeShopping(s.id)
      setShopping((xs) => xs.filter((i) => i.id !== s.id))
    }
    return shop.length
  })

  /** 요리 완료: 사용량만큼 차감 (단위가 같을 때만, 유통기한 임박 순으로) */
  const consume = (usages: Usage[]) => run(async () => {
    let changed = 0
    const next = [...items]
    for (const u of usages) {
      let remain = u.qty
      const cands = next.filter((i) => i.ingredientId === u.ingredientId && i.unit === u.unit)
        .sort((a, b) => a.expiresAt.localeCompare(b.expiresAt))
      for (const it of cands) {
        if (remain <= 0) break
        const used = Math.min(it.qty, remain)
        remain -= used
        const left = Math.round((it.qty - used) * 100) / 100
        if (left <= 0) { await repo.removeItem(it.id); next.splice(next.indexOf(it), 1) }
        else { await repo.updateItem(it.id, { qty: left }); next[next.indexOf(it)] = { ...it, qty: left } }
        changed++
      }
    }
    setItems(next)
    return changed
  })

  return { items, shopping, loading, error, reload, addItem, updateItem, removeItem, addShopping, updateShopping, removeShopping, purchase, consume }
}
export type Fridge = ReturnType<typeof useFridge>
