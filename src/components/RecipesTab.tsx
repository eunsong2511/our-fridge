import { useMemo, useState } from 'react'
import type { Fridge } from '../hooks/useFridge'
import type { Settings } from '../lib/types'
import { fmtAmount, rankRecipes, type IngredientLine, type RecipeMatch } from '../lib/match'
import { RECIPES } from '../data/recipes'
import { ingredientById } from '../data/ingredients'
import { Badge, Button, Empty, Sheet, Stepper } from './ui'

type Mode = '지금 가능' | '1개만 부족' | '전체'

export function RecipesTab({ fridge, settings, servings, setServings, toast }: { fridge: Fridge; settings: Settings; servings: number; setServings: (n: number) => void; toast: (m: string) => void }) {
  const [mode, setMode] = useState<Mode>('지금 가능')
  const [tag, setTag] = useState<string>('전체')
  const [openId, setOpenId] = useState<string | null>(null)

  const ranked = useMemo(() => rankRecipes(fridge.items, servings, settings.alertDays), [fridge.items, servings, settings.alertDays])
  const tags = useMemo(() => ['전체', ...new Set(RECIPES.flatMap((r) => r.tags))], [])
  const list = ranked.filter((m) => {
    if (mode === '지금 가능' && m.missing.length > 0) return false
    if (mode === '1개만 부족' && m.missing.length !== 1) return false
    if (tag !== '전체' && !m.recipe.tags.includes(tag)) return false
    return true
  })
  const possible = ranked.filter((m) => m.missing.length === 0).length
  const open = ranked.find((m) => m.recipe.id === openId) ?? null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
        <div>
          <p className="text-sm font-semibold">몇 인분 만들까요?</p>
          <p className="text-xs text-slate-400">재료 양이 인분에 맞게 바뀌어요</p>
        </div>
        <Stepper value={servings} onChange={setServings} />
      </div>

      <div className="flex gap-1.5">
        {(['지금 가능', '1개만 부족', '전체'] as Mode[]).map((m) => (
          <button key={m} onClick={() => setMode(m)} className={`rounded-full px-3 py-1 text-sm ${mode === m ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-600'}`}>
            {m}{m === '지금 가능' ? ` ${possible}` : ''}
          </button>
        ))}
      </div>
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {tags.map((t) => (
          <button key={t} onClick={() => setTag(t)} className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs ${tag === t ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{t}</button>
        ))}
      </div>

      {list.length === 0 ? (
        <Empty icon="🍳" title={fridge.items.length === 0 ? '냉장고에 재료를 먼저 넣어주세요' : '조건에 맞는 요리가 없어요'} desc={mode !== '전체' ? '"1개만 부족" 이나 "전체"를 눌러보세요' : undefined} />
      ) : (
        <ul className="space-y-2">
          {list.map((m) => <RecipeCard key={m.recipe.id} m={m} onOpen={() => setOpenId(m.recipe.id)} />)}
        </ul>
      )}

      <RecipeDetail m={open} onClose={() => setOpenId(null)} servings={servings} setServings={setServings} fridge={fridge} toast={toast} />
    </div>
  )
}

function RecipeCard({ m, onOpen }: { m: RecipeMatch; onOpen: () => void }) {
  const ok = m.missing.length === 0
  return (
    <li>
      <button onClick={onOpen} className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left hover:bg-slate-50">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-bold">{m.recipe.name}</p>
            <p className="truncate text-xs text-slate-500">{m.recipe.desc}</p>
          </div>
          <Badge className={ok ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}>{ok ? '지금 가능' : `${m.missing.length}개 부족`}</Badge>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          <span>⏱ {m.recipe.minutes}분</span><span>난이도 {m.recipe.difficulty}</span>
          <span>재료 {m.haveCount}/{m.requiredCount}</span>
          {m.usesExpiring > 0 && <span className="font-semibold text-amber-600">⏰ 임박 재료 {m.usesExpiring}개 소진</span>}
        </div>
        {!ok && <p className="mt-1.5 text-xs text-red-500">부족: {m.missing.map((l) => l.name).join(', ')}</p>}
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-emerald-500" style={{ width: `${m.score}%` }} /></div>
      </button>
    </li>
  )
}

function Line({ l, muted }: { l: IngredientLine; muted?: boolean }) {
  const status = !l.have ? (muted ? 'text-slate-400' : 'text-red-500') : l.enough === false ? 'text-amber-600' : 'text-emerald-700'
  const mark = !l.have ? (muted ? '–' : '✗') : l.enough === false ? '△' : '✓'
  return (
    <li className="flex items-center justify-between py-1.5 text-sm">
      <span className="flex items-center gap-2">
        <span className={`w-4 text-center font-bold ${status}`}>{mark}</span>
        <span className={!l.have && !muted ? 'text-slate-500' : ''}>{l.name}{l.optional && <span className="ml-1 text-xs text-slate-400">(선택)</span>}{l.expiring && <span className="ml-1 text-xs text-amber-600">⏰</span>}</span>
      </span>
      <span className="text-right">
        <span className="font-semibold">{fmtAmount(l.scaled, l.unit)}</span>
        {l.have && l.haveQty !== undefined && <span className="ml-1 text-xs text-slate-400">보유 {fmtAmount(l.haveQty, l.unit)}</span>}
        {l.have && l.haveQty === undefined && l.haveUnit && <span className="ml-1 text-xs text-slate-400">보유({l.haveUnit})</span>}
      </span>
    </li>
  )
}

function RecipeDetail({ m, onClose, servings, setServings, fridge, toast }: { m: RecipeMatch | null; onClose: () => void; servings: number; setServings: (n: number) => void; fridge: Fridge; toast: (m: string) => void }) {
  const [done, setDone] = useState<number[]>([])
  if (!m) return null
  const r = m.recipe
  const toShop = m.missing.filter((l) => !fridge.shopping.some((s) => s.ingredientId === l.id))
  const addMissing = async () => {
    for (const l of toShop) await fridge.addShopping({ name: l.name, ingredientId: l.id, qty: Math.ceil(l.scaled), unit: ingredientById(l.id)?.unit ?? l.unit, done: false })
    toast(`${toShop.length}개를 장보기 목록에 담았어요`)
  }
  const cook = async () => {
    const usages = [...m.required, ...m.optional, ...m.seasonings].filter((l) => l.have && l.haveQty !== undefined).map((l) => ({ ingredientId: l.id, qty: l.scaled, unit: l.unit }))
    const n = await fridge.consume(usages)
    toast(n ? `맛있게 드세요! 재료 ${n}건을 냉장고에서 차감했어요.` : '차감할 재료가 없어요 (단위가 달라 자동 차감되지 않은 재료는 직접 수정해주세요)')
    onClose()
  }
  return (
    <Sheet open={!!m} onClose={onClose} title={r.name}>
      <p className="text-sm text-slate-500">{r.desc}</p>
      <div className="mt-2 flex flex-wrap gap-x-3 text-xs text-slate-500"><span>⏱ {r.minutes}분</span><span>난이도 {r.difficulty}</span><span>{r.tags.join(' · ')}</span></div>

      <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
        <span className="text-sm font-semibold">인분</span>
        <Stepper value={servings} onChange={setServings} />
      </div>

      <h3 className="mt-4 text-xs font-bold tracking-wide text-slate-400">주재료 ({servings}인분)</h3>
      <ul className="divide-y divide-slate-100">
        {m.required.map((l) => <Line key={l.id} l={l} />)}
        {m.optional.map((l) => <Line key={l.id} l={l} muted />)}
      </ul>
      {m.seasonings.length > 0 && (<>
        <h3 className="mt-4 text-xs font-bold tracking-wide text-slate-400">양념 <span className="font-normal">· 냉장고에 등록하지 않은 양념은 있다고 가정해요</span></h3>
        <ul className="divide-y divide-slate-100">{m.seasonings.map((l) => <Line key={l.id} l={l} muted />)}</ul>
      </>)}

      <h3 className="mt-4 text-xs font-bold tracking-wide text-slate-400">만드는 법</h3>
      <ol className="mt-1 space-y-2">
        {r.steps.map((s, i) => (
          <li key={i} className="flex gap-3">
            <button onClick={() => setDone((d) => d.includes(i) ? d.filter((x) => x !== i) : [...d, i])}
              className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${done.includes(i) ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{i + 1}</button>
            <p className={`text-sm leading-relaxed ${done.includes(i) ? 'text-slate-400 line-through' : ''}`}>{s}</p>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-slate-400">물·소금 등 "1인분당" 표기는 선택한 인분 수를 곱해주세요.</p>

      <div className="mt-5 flex gap-2">
        {m.missing.length > 0 && <Button variant="outline" className="flex-1" disabled={toShop.length === 0} onClick={addMissing}>{toShop.length ? `부족한 ${toShop.length}개 장보기 담기` : '장보기에 담겨 있어요'}</Button>}
        <Button className="flex-1" onClick={cook}>요리 완료 · 재료 차감</Button>
      </div>
    </Sheet>
  )
}
