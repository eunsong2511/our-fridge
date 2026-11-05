import { useMemo, useState } from 'react'
import type { Fridge } from '../hooks/useFridge'
import { ingredientById, resolveIngredientId, searchIngredients } from '../data/ingredients'
import { suggestIngredients } from '../lib/match'
import { Button, Empty, inputCls } from './ui'

export function ShoppingTab({ fridge, toast }: { fridge: Fridge; toast: (m: string) => void }) {
  const [name, setName] = useState('')
  const [focus, setFocus] = useState(false)
  const suggestions = useMemo(() => suggestIngredients(fridge.items, 8), [fridge.items])
  const auto = useMemo(() => (focus ? searchIngredients(name, 5) : []), [name, focus])
  const inList = new Set(fridge.shopping.map((s) => s.ingredientId ?? resolveIngredientId(s.name)))

  const add = async (n: string, ingId?: string) => {
    const trimmed = n.trim(); if (!trimmed) return
    const id = ingId ?? resolveIngredientId(trimmed)
    const ing = id ? ingredientById(id) : undefined
    await fridge.addShopping({ name: ing?.name ?? trimmed, ingredientId: id, qty: 1, unit: ing?.unit ?? '개', done: false })
    setName('')
  }
  const checked = fridge.shopping.filter((s) => s.done)
  const buy = async () => {
    const n = await fridge.purchase(checked)
    if (n) toast(`${n}개를 냉장고에 넣었어요. 유통기한은 냉장고 탭에서 확인하세요.`)
  }

  return (
    <div className="space-y-5">
      <form onSubmit={(e) => { e.preventDefault(); void add(name) }} className="relative flex gap-2">
        <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setTimeout(() => setFocus(false), 150)} placeholder="살 것 입력 (예: 두부)" />
        <Button type="submit">담기</Button>
        {auto.length > 0 && name && (
          <ul className="absolute top-full z-10 mt-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
            {auto.map((s) => <li key={s.id}><button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => add(s.name, s.id)} className="w-full px-3 py-2 text-left text-sm hover:bg-emerald-50">{s.name} <span className="text-xs text-slate-400">{s.category}</span></button></li>)}
          </ul>
        )}
      </form>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-xs font-bold tracking-wide text-slate-400">장보기 목록 · {fridge.shopping.length}</h3>
          {checked.length > 0 && <Button className="py-1.5 text-xs" onClick={buy}>체크한 {checked.length}개 냉장고에 넣기</Button>}
        </div>
        {fridge.shopping.length === 0 ? <Empty icon="🛒" title="장보기 목록이 비어 있어요" desc="아래 추천에서 ＋ 를 눌러 담아보세요" /> : (
          <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {fridge.shopping.map((s) => (
              <li key={s.id} className="flex items-center gap-3 px-4 py-3">
                <input type="checkbox" className="size-5 accent-emerald-600" checked={s.done} onChange={(e) => fridge.updateShopping(s.id, { done: e.target.checked })} />
                <span className={`flex-1 ${s.done ? 'text-slate-400 line-through' : ''}`}>{s.name}</span>
                <div className="flex items-center gap-1 text-sm">
                  <button className="rounded-md px-2 text-slate-500 hover:bg-slate-100" onClick={() => fridge.updateShopping(s.id, { qty: Math.max(0.5, s.qty - 1) })}>−</button>
                  <span className="min-w-10 text-center text-slate-600">{s.qty}{s.unit}</span>
                  <button className="rounded-md px-2 text-slate-500 hover:bg-slate-100" onClick={() => fridge.updateShopping(s.id, { qty: s.qty + 1 })}>＋</button>
                </div>
                <button className="ml-1 text-slate-300 hover:text-red-500" onClick={() => fridge.removeShopping(s.id)} aria-label="삭제">✕</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="mb-2 text-xs font-bold tracking-wide text-slate-400">식재료 추천</h3>
        {suggestions.length === 0 ? <p className="text-sm text-slate-400">냉장고에 재료를 몇 개 넣으면 추천이 나와요.</p> : (
          <ul className="space-y-2">
            {suggestions.map((s) => {
              const already = inList.has(s.ingredientId)
              return (
                <li key={s.ingredientId} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{s.name}</p>
                    <p className="truncate text-xs text-slate-500">
                      {s.reason === 'staple' ? '기본 상비 재료가 떨어졌어요'
                        : s.unlocks.length ? `이것만 사면 ${s.unlocks.slice(0, 3).join(', ')}${s.unlocks.length > 3 ? ` 외 ${s.unlocks.length - 3}개` : ''} 완성`
                        : `${s.nearly.slice(0, 2).join(', ')} 등 ${s.nearly.length}개 요리에 필요`}
                    </p>
                  </div>
                  <Button variant={already ? 'ghost' : 'outline'} className="py-1.5 text-xs" disabled={already} onClick={() => add(s.name, s.ingredientId)}>{already ? '담김' : '＋ 담기'}</Button>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
