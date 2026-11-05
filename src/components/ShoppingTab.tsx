import { useMemo, useState } from 'react'
import { Check, Lightbulb, Minus, Plus, Trash2 } from 'lucide-react'
import type { Fridge } from '../hooks/useFridge'
import { ingredientById, resolveIngredientId, searchIngredients } from '../data/ingredients'
import { suggestIngredients } from '../lib/match'
import { CATEGORY_TONE, IconTile } from '../lib/visual'
import { Button, Card, Empty, SectionTitle, inputCls } from './ui'

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
    <div className="space-y-6">
      <form onSubmit={(e) => { e.preventDefault(); void add(name) }} className="relative flex gap-2">
        <input className={`${inputCls} shadow-card`} value={name} onChange={(e) => setName(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setTimeout(() => setFocus(false), 150)} placeholder="살 것 입력 (예: 두부)" />
        <Button type="submit" variant="accent"><Plus size={16} strokeWidth={3} />담기</Button>
        {auto.length > 0 && name && (
          <ul className="absolute top-full z-10 mt-2 w-full overflow-hidden rounded-2xl border border-line bg-paper shadow-float animate-rise">
            {auto.map((s) => (
              <li key={s.id}><button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => add(s.name, s.id)} className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm hover:bg-cream">
                <IconTile tone={CATEGORY_TONE[s.category]} size="sm" /><span className="font-semibold">{s.name}</span><span className="text-xs text-ink-3">{s.category}</span></button></li>
            ))}
          </ul>
        )}
      </form>

      <section>
        <SectionTitle right={checked.length > 0 && <Button size="sm" onClick={buy}><Check size={14} strokeWidth={3} />{checked.length}개 냉장고에 넣기</Button>}>
          장보기 목록 <span className="ml-1 text-ink-3">{fridge.shopping.length}</span>
        </SectionTitle>
        {fridge.shopping.length === 0 ? <Empty art="basket" title="장보기 목록이 비어 있어요" desc="아래 추천에서 담거나, 요리 상세에서 부족한 재료를 한 번에 담을 수 있어요" /> : (
          <Card className="overflow-hidden">
            <ul className="stagger divide-y divide-line/70">
              {fridge.shopping.map((s) => {
                const ing = s.ingredientId ? ingredientById(s.ingredientId) : undefined
                return (
                  <li key={s.id} className={`flex items-center gap-3 px-4 py-3 transition ${s.done ? 'bg-cream/50' : ''}`}>
                    <button onClick={() => fridge.updateShopping(s.id, { done: !s.done })} aria-label="체크"
                      className={`flex size-7 shrink-0 items-center justify-center rounded-full border-2 transition-all ${s.done ? 'border-leaf bg-leaf text-white' : 'border-line bg-paper text-transparent'}`}><Check size={14} strokeWidth={3.5} /></button>
                    {ing && <IconTile tone={CATEGORY_TONE[ing.category]} size="sm" className={s.done ? 'opacity-50' : ''} />}
                    <span className={`flex-1 text-[15px] font-semibold ${s.done ? 'text-ink-3 line-through' : ''}`}>{s.name}</span>
                    <div className="flex items-center rounded-xl bg-cream-2 p-0.5">
                      <button className="flex size-7 items-center justify-center rounded-lg text-ink-2 hover:bg-paper" onClick={() => fridge.updateShopping(s.id, { qty: Math.max(0.5, s.qty - 1) })}><Minus size={13} /></button>
                      <span className="min-w-11 text-center text-xs font-bold tabular-nums text-ink-2">{s.qty}{s.unit}</span>
                      <button className="flex size-7 items-center justify-center rounded-lg text-ink-2 hover:bg-paper" onClick={() => fridge.updateShopping(s.id, { qty: s.qty + 1 })}><Plus size={13} /></button>
                    </div>
                    <button className="p-1 text-ink-3 transition hover:text-berry" onClick={() => fridge.removeShopping(s.id)} aria-label="삭제"><Trash2 size={16} /></button>
                  </li>
                )
              })}
            </ul>
          </Card>
        )}
      </section>

      <section>
        <SectionTitle><span className="inline-flex items-center gap-1.5"><Lightbulb size={14} className="text-tangerine" />식재료 추천</span></SectionTitle>
        {suggestions.length === 0 ? <p className="px-1 text-sm text-ink-3">냉장고에 재료를 몇 개 넣으면 추천이 나와요.</p> : (
          <ul className="stagger space-y-2">
            {suggestions.map((s) => {
              const already = inList.has(s.ingredientId)
              const ing = ingredientById(s.ingredientId)!
              return (
                <li key={s.ingredientId} className="flex items-center gap-3 rounded-card bg-paper px-4 py-3 shadow-card">
                  <IconTile tone={CATEGORY_TONE[ing.category]} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-bold">{s.name}</p>
                    <p className="truncate text-xs text-ink-2">
                      {s.reason === 'staple' ? '기본 상비 재료가 떨어졌어요'
                        : s.unlocks.length ? <>이것만 사면 <b className="text-tangerine-deep">{s.unlocks.slice(0, 3).join(', ')}</b>{s.unlocks.length > 3 ? ` 외 ${s.unlocks.length - 3}개` : ''} 완성</>
                        : `${s.nearly.slice(0, 2).join(', ')} 등 ${s.nearly.length}개 요리에 필요`}
                    </p>
                  </div>
                  <Button size="sm" variant={already ? 'ghost' : 'soft'} disabled={already} onClick={() => add(s.name, s.ingredientId)}>{already ? '담김' : <><Plus size={14} strokeWidth={3} />담기</>}</Button>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
