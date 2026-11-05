import { useMemo, useState } from 'react'
import { AlarmClock, Check, ChefHat, ChevronRight, Clock, Flame, ShoppingBasket } from 'lucide-react'
import type { Fridge } from '../hooks/useFridge'
import type { Settings } from '../lib/types'
import { fmtAmount, rankRecipes, type IngredientLine, type RecipeMatch } from '../lib/match'
import { RECIPES } from '../data/recipes'
import { ingredientById } from '../data/ingredients'
import { IconTile, recipeTone } from '../lib/visual'
import { Badge, Button, Card, Chip, Empty, SectionTitle, Sheet, Stepper } from './ui'

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
  const hero = list[0]

  return (
    <div className="space-y-5">
      <Card className="flex items-center justify-between px-4 py-3.5">
        <div>
          <p className="text-[15px] font-extrabold">몇 인분 만들까요?</p>
          <p className="text-xs text-ink-3">재료 양이 인분에 맞게 바뀌어요</p>
        </div>
        <Stepper value={servings} onChange={setServings} />
      </Card>

      <div className="no-scrollbar -mx-5 flex gap-1.5 overflow-x-auto px-5">
        {(['지금 가능', '1개만 부족', '전체'] as Mode[]).map((m) => (
          <Chip key={m} active={mode === m} onClick={() => setMode(m)}>{m}{m === '지금 가능' ? ` ${possible}` : ''}</Chip>
        ))}
      </div>
      <div className="no-scrollbar -mx-5 flex gap-1.5 overflow-x-auto px-5">
        {tags.map((t) => (
          <button key={t} onClick={() => setTag(t)} className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold transition-all active:scale-95 ${tag === t ? 'bg-leaf-soft text-leaf-deep ring-1 ring-leaf/40' : 'bg-cream-2 text-ink-2'}`}>{t}</button>
        ))}
      </div>

      {list.length === 0 ? (
        <Empty art="pot" title={fridge.items.length === 0 ? '냉장고에 재료를 먼저 넣어주세요' : '조건에 맞는 요리가 없어요'} desc={mode !== '전체' ? '"1개만 부족" 이나 "전체"를 눌러보세요' : undefined} />
      ) : (
        <>
          {hero && mode === '지금 가능' && tag === '전체' && <HeroCard m={hero} onOpen={() => setOpenId(hero.recipe.id)} />}
          <section>
            {hero && mode === '지금 가능' && tag === '전체' && <SectionTitle>다른 추천 <span className="ml-1 text-ink-3">{list.length - 1}</span></SectionTitle>}
            <ul className="stagger space-y-2.5">
              {(hero && mode === '지금 가능' && tag === '전체' ? list.slice(1) : list).map((m) => <RecipeCard key={m.recipe.id} m={m} onOpen={() => setOpenId(m.recipe.id)} />)}
            </ul>
          </section>
        </>
      )}

      <RecipeDetail m={open} onClose={() => setOpenId(null)} servings={servings} setServings={setServings} fridge={fridge} toast={toast} />
    </div>
  )
}

function HeroCard({ m, onOpen }: { m: RecipeMatch; onOpen: () => void }) {
  const tone = recipeTone(m.recipe.tags)
  return (
    <button onClick={onOpen} className="relative w-full overflow-hidden rounded-card bg-gradient-to-br from-tangerine to-tangerine-deep p-5 text-left text-white shadow-[0_16px_32px_-12px_rgba(214,110,22,.55)] transition active:scale-[0.99] animate-rise">
      <div className="pointer-events-none absolute -right-6 -top-8 size-36 rounded-full bg-white/10" />
      <p className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-extrabold"><Flame size={12} />오늘의 추천</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[26px] font-extrabold leading-tight tracking-tight">{m.recipe.name}</p>
          <p className="mt-1 truncate text-sm text-white/85">{m.recipe.desc}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-white/90">
            <span className="inline-flex items-center gap-1"><Clock size={13} />{m.recipe.minutes}분</span><span>난이도 {m.recipe.difficulty}</span>
            {m.usesExpiring > 0 && <span className="inline-flex items-center gap-1 rounded-full bg-white/25 px-2 py-0.5"><AlarmClock size={12} />임박 재료 {m.usesExpiring}개 소진</span>}
          </div>
        </div>
        <IconTile tone={{ ...tone, bg: 'bg-white/20', fg: 'text-white' }} size="lg" />
      </div>
    </button>
  )
}

function RecipeCard({ m, onOpen }: { m: RecipeMatch; onOpen: () => void }) {
  const ok = m.missing.length === 0
  const tone = recipeTone(m.recipe.tags)
  return (
    <li>
      <button onClick={onOpen} className={`flex w-full items-center gap-3 rounded-card bg-paper p-3.5 text-left shadow-card transition active:scale-[0.99] ${ok ? '' : 'opacity-90'}`}>
        <IconTile tone={tone} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-[15px] font-extrabold">{m.recipe.name}</p>
            {ok ? <Badge className="bg-leaf-soft text-leaf-deep"><Check size={11} strokeWidth={3.5} />가능</Badge> : <Badge className="bg-cream-2 text-ink-2">{m.missing.length}개 부족</Badge>}
          </div>
          <p className="truncate text-xs text-ink-3">{m.recipe.desc}</p>
          <div className="mt-1.5 flex items-center gap-2 text-[11px] font-semibold text-ink-2">
            <span className="inline-flex items-center gap-0.5"><Clock size={11} />{m.recipe.minutes}분</span>
            <span className="text-ink-3">·</span><span>재료 {m.haveCount}/{m.requiredCount}</span>
            {m.usesExpiring > 0 && <><span className="text-ink-3">·</span><span className="inline-flex items-center gap-0.5 text-honey"><AlarmClock size={11} />임박 {m.usesExpiring}</span></>}
          </div>
          {!ok && <p className="mt-1 truncate text-[11px] text-berry">부족: {m.missing.map((l) => l.name).join(', ')}</p>}
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-cream-2"><div className={`h-full rounded-full ${ok ? 'bg-leaf' : 'bg-ink-3'}`} style={{ width: `${m.score}%` }} /></div>
        </div>
        <ChevronRight size={16} className="text-ink-3/60" />
      </button>
    </li>
  )
}

function Line({ l, muted }: { l: IngredientLine; muted?: boolean }) {
  const state = !l.have ? (muted ? 'none' : 'missing') : l.enough === false ? 'low' : 'ok'
  const dot = { ok: 'bg-leaf text-white', low: 'bg-honey text-white', missing: 'bg-berry-soft text-berry', none: 'bg-cream-2 text-ink-3' }[state]
  const mark = { ok: '✓', low: '△', missing: '✗', none: '–' }[state]
  return (
    <li className="flex items-center justify-between gap-3 py-2.5 text-sm">
      <span className="flex min-w-0 items-center gap-2.5">
        <span className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold ${dot}`}>{mark}</span>
        <span className={`truncate font-semibold ${state === 'missing' ? 'text-ink-2' : state === 'none' ? 'text-ink-3' : 'text-ink'}`}>{l.name}</span>
        {l.optional && <span className="shrink-0 text-[11px] text-ink-3">선택</span>}
        {l.expiring && <AlarmClock size={12} className="shrink-0 text-honey" />}
      </span>
      <span className="shrink-0 text-right">
        <span className="font-extrabold tabular-nums">{fmtAmount(l.scaled, l.unit)}</span>
        {l.have && l.haveQty !== undefined && <span className="ml-1.5 text-[11px] text-ink-3">보유 {fmtAmount(l.haveQty, l.unit)}</span>}
        {l.have && l.haveQty === undefined && l.haveUnit && <span className="ml-1.5 text-[11px] text-ink-3">보유({l.haveUnit})</span>}
      </span>
    </li>
  )
}

function RecipeDetail({ m, onClose, servings, setServings, fridge, toast }: { m: RecipeMatch | null; onClose: () => void; servings: number; setServings: (n: number) => void; fridge: Fridge; toast: (m: string) => void }) {
  const [done, setDone] = useState<number[]>([])
  if (!m) return null
  const r = m.recipe
  const tone = recipeTone(r.tags)
  const toShop = m.missing.filter((l) => !fridge.shopping.some((s) => s.ingredientId === l.id))
  const addMissing = async () => {
    for (const l of toShop) await fridge.addShopping({ name: l.name, ingredientId: l.id, qty: Math.ceil(l.scaled), unit: ingredientById(l.id)?.unit ?? l.unit, done: false })
    toast(`${toShop.length}개를 장보기 목록에 담았어요`)
  }
  const cook = async () => {
    const usages = [...m.required, ...m.optional, ...m.seasonings].filter((l) => l.have && l.haveQty !== undefined).map((l) => ({ ingredientId: l.id, qty: l.scaled, unit: l.unit }))
    const n = await fridge.consume(usages)
    toast(n ? `맛있게 드세요! 재료 ${n}건을 냉장고에서 차감했어요.` : '차감할 재료가 없어요 (단위가 다른 재료는 직접 수정해주세요)')
    onClose()
  }
  return (
    <Sheet open={!!m} onClose={onClose} title={r.name} subtitle={r.desc}>
      <div className="flex items-center gap-3">
        <IconTile tone={tone} size="lg" />
        <div className="flex flex-wrap gap-1.5">
          <Badge className="bg-cream-2 text-ink-2"><Clock size={11} />{r.minutes}분</Badge>
          <Badge className="bg-cream-2 text-ink-2">난이도 {r.difficulty}</Badge>
          {r.tags.map((t) => <Badge key={t} className="bg-leaf-soft text-leaf-deep">{t}</Badge>)}
        </div>
      </div>

      <Card className="mt-4 flex items-center justify-between px-4 py-3">
        <div><p className="text-sm font-extrabold">인분</p><p className="text-[11px] text-ink-3">바꾸면 아래 분량이 환산돼요</p></div>
        <Stepper value={servings} onChange={setServings} />
      </Card>

      <Card className="mt-3 px-4 py-2">
        <SectionTitle>주재료 · {servings}인분</SectionTitle>
        <ul className="divide-y divide-line/70">
          {m.required.map((l) => <Line key={l.id} l={l} />)}
          {m.optional.map((l) => <Line key={l.id} l={l} muted />)}
        </ul>
      </Card>
      {m.seasonings.length > 0 && (
        <Card className="mt-3 px-4 py-2">
          <SectionTitle>양념</SectionTitle>
          <p className="-mt-1 mb-1 px-1 text-[11px] text-ink-3">냉장고에 등록하지 않은 양념은 있다고 가정해요</p>
          <ul className="divide-y divide-line/70">{m.seasonings.map((l) => <Line key={l.id} l={l} muted />)}</ul>
        </Card>
      )}

      <Card className="mt-3 px-4 py-3">
        <SectionTitle><span className="inline-flex items-center gap-1.5"><ChefHat size={14} className="text-leaf" />만드는 법</span></SectionTitle>
        <ol className="space-y-3">
          {r.steps.map((s, i) => {
            const d = done.includes(i)
            return (
              <li key={i} className="flex gap-3">
                <button onClick={() => setDone((x) => x.includes(i) ? x.filter((y) => y !== i) : [...x, i])}
                  className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold transition-all ${d ? 'bg-leaf text-white' : 'bg-leaf-soft text-leaf-deep'}`}>{d ? <Check size={14} strokeWidth={3.5} /> : i + 1}</button>
                <p className={`text-[14.5px] leading-relaxed transition ${d ? 'text-ink-3 line-through' : 'text-ink'}`}>{s}</p>
              </li>
            )
          })}
        </ol>
        <p className="mt-3 text-[11px] text-ink-3">"1인분당" 표기된 물·소금은 선택한 인분 수를 곱해주세요.</p>
      </Card>

      <div className="sticky bottom-0 -mx-5 mt-4 flex gap-2 bg-gradient-to-t from-cream via-cream to-cream/0 px-5 pt-4 pb-1">
        {m.missing.length > 0 && <Button variant="outline" size="lg" className="flex-1" disabled={toShop.length === 0} onClick={addMissing}><ShoppingBasket size={16} />{toShop.length ? `부족한 ${toShop.length}개 담기` : '장보기에 담김'}</Button>}
        <Button size="lg" className="flex-1" onClick={cook}><Check size={16} strokeWidth={3} />요리 완료 · 차감</Button>
      </div>
    </Sheet>
  )
}
