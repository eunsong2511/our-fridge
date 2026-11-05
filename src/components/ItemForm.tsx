import { useEffect, useMemo, useState } from 'react'
import { CATEGORIES, STORAGES, ingredientById, resolveIngredientId, searchIngredients, type Category, type Storage } from '../data/ingredients'
import { addDays, daysLeft, todayStr } from '../lib/dates'
import type { FridgeItem, NewFridgeItem } from '../lib/types'
import { Button, Field, Segmented, Sheet, inputCls } from './ui'

const UNITS = ['개', 'g', 'ml', '봉', '팩', '모', '장', '마리', '쪽', '대', '캔', '포기', '큰술', '작은술']

interface Props {
  open: boolean
  initial?: FridgeItem | null
  onClose: () => void
  onSave: (item: NewFridgeItem) => Promise<unknown>
  onDelete?: (id: string) => Promise<unknown>
}

export function ItemForm({ open, initial, onClose, onSave, onDelete }: Props) {
  const today = todayStr()
  const [name, setName] = useState('')
  const [ingredientId, setIngredientId] = useState<string | undefined>()
  const [category, setCategory] = useState<Category>('채소')
  const [qty, setQty] = useState('1')
  const [unit, setUnit] = useState('개')
  const [storage, setStorage] = useState<Storage>('냉장')
  const [purchasedAt, setPurchasedAt] = useState(today)
  const [expiresAt, setExpiresAt] = useState(addDays(today, 7))
  const [memo, setMemo] = useState('')
  const [touchedExpiry, setTouchedExpiry] = useState(false)
  const [showSuggest, setShowSuggest] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    if (initial) {
      setName(initial.name); setIngredientId(initial.ingredientId); setCategory(initial.category)
      setQty(String(initial.qty)); setUnit(initial.unit); setStorage(initial.storage)
      setPurchasedAt(initial.purchasedAt); setExpiresAt(initial.expiresAt); setMemo(initial.memo ?? '')
      setTouchedExpiry(true)
    } else {
      setName(''); setIngredientId(undefined); setCategory('채소'); setQty('1'); setUnit('개'); setStorage('냉장')
      setPurchasedAt(today); setExpiresAt(addDays(today, 7)); setMemo(''); setTouchedExpiry(false)
    }
    setShowSuggest(false)
  }, [open, initial, today])

  const suggestions = useMemo(() => (showSuggest && !initial ? searchIngredients(name) : []), [name, showSuggest, initial])

  // 카탈로그 재료 선택/보관방법 변경 시 유통기한 자동 추천 (사용자가 직접 수정하기 전까지)
  const applyShelf = (ingId: string | undefined, st: Storage, from: string) => {
    const ing = ingId ? ingredientById(ingId) : undefined
    const days = ing?.shelf[st] ?? ing?.shelf[ing.defaultStorage] ?? 7
    setExpiresAt(addDays(from, days))
  }

  const pick = (id: string) => {
    const ing = ingredientById(id)!
    setName(ing.name); setIngredientId(id); setCategory(ing.category); setUnit(ing.unit); setStorage(ing.defaultStorage)
    setShowSuggest(false)
    if (!touchedExpiry) applyShelf(id, ing.defaultStorage, purchasedAt)
  }

  const onNameChange = (v: string) => {
    setName(v); setShowSuggest(true)
    const id = resolveIngredientId(v)
    setIngredientId(id)
    if (id && !initial) {
      const ing = ingredientById(id)!
      setCategory(ing.category)
      if (!touchedExpiry) applyShelf(id, storage, purchasedAt)
    }
  }

  const changeStorage = (st: Storage) => {
    setStorage(st)
    if (!touchedExpiry) applyShelf(ingredientId, st, purchasedAt)
  }
  const changePurchased = (d: string) => {
    setPurchasedAt(d)
    if (!touchedExpiry) applyShelf(ingredientId, storage, d)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    await onSave({ name: name.trim(), ingredientId, category, qty: Number(qty) || 1, unit, storage, purchasedAt, expiresAt, memo: memo.trim() || undefined })
    setSaving(false)
    onClose()
  }

  const left = daysLeft(expiresAt)
  return (
    <Sheet open={open} onClose={onClose} title={initial ? '식재료 수정' : '식재료 추가'}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="이름" hint={ingredientId ? `✓ "${ingredientById(ingredientId)?.name}"로 인식 — 요리 추천에 사용됩니다` : name ? '목록에 없는 재료예요. 저장은 되지만 요리 추천 매칭은 안 됩니다.' : undefined}>
          <div className="relative">
            <input className={inputCls} value={name} onChange={(e) => onNameChange(e.target.value)} onFocus={() => setShowSuggest(true)}
              placeholder="예: 달걀, 삼겹살, 우유" autoFocus={!initial} required />
            {suggestions.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                {suggestions.map((s) => (
                  <li key={s.id}>
                    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => pick(s.id)}
                      className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-emerald-50">
                      <span>{s.name}</span><span className="text-xs text-slate-400">{s.category} · {s.defaultStorage} {s.shelf[s.defaultStorage]}일</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="수량">
            <input className={inputCls} type="number" inputMode="decimal" min="0" step="any" value={qty} onChange={(e) => setQty(e.target.value)} />
          </Field>
          <Field label="단위">
            <select className={inputCls} value={unit} onChange={(e) => setUnit(e.target.value)}>
              {[...new Set([unit, ...UNITS])].map((u) => <option key={u}>{u}</option>)}
            </select>
          </Field>
        </div>
        <Field label="보관"><Segmented value={storage} options={STORAGES} onChange={changeStorage} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="구매일"><input className={inputCls} type="date" value={purchasedAt} onChange={(e) => changePurchased(e.target.value)} /></Field>
          <Field label="유통기한" hint={left < 0 ? `${-left}일 지남` : left === 0 ? '오늘까지' : `${left}일 남음`}>
            <input className={inputCls} type="date" value={expiresAt} onChange={(e) => { setExpiresAt(e.target.value); setTouchedExpiry(true) }} required />
          </Field>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[3, 7, 14, 30].map((d) => (
            <button key={d} type="button" onClick={() => { setExpiresAt(addDays(purchasedAt, d)); setTouchedExpiry(true) }}
              className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-50">+{d}일</button>
          ))}
        </div>
        <Field label="분류">
          <select className={inputCls} value={category} onChange={(e) => setCategory(e.target.value as Category)}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="메모 (선택)"><input className={inputCls} value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="예: 반 남음" /></Field>
        <div className="flex gap-2 pt-2">
          {initial && onDelete && (
            <Button type="button" variant="danger" onClick={async () => { await onDelete(initial.id); onClose() }}>삭제</Button>
          )}
          <Button type="submit" className="flex-1" disabled={saving}>{initial ? '저장' : '냉장고에 넣기'}</Button>
        </div>
      </form>
    </Sheet>
  )
}
