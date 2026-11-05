import { useMemo, useState } from 'react'
import { AlarmClock, ArrowRight, ChevronRight, Plus, Search } from 'lucide-react'
import type { Fridge } from '../hooks/useFridge'
import type { FridgeItem, Settings } from '../lib/types'
import { dDayLabel, daysLeft, formatKDate, urgency } from '../lib/dates'
import { STORAGES, type Storage } from '../data/ingredients'
import { rankRecipes } from '../lib/match'
import { CATEGORY_TONE, IconTile } from '../lib/visual'
import { ItemForm } from './ItemForm'
import { Badge, Button, Card, Chip, Empty, SectionTitle, Skeleton, urgencyBar, urgencyStyle } from './ui'

type Filter = '전체' | Storage | '임박'

export function FridgeTab({ fridge, settings, goCook }: { fridge: Fridge; settings: Settings; goCook: () => void }) {
  const [filter, setFilter] = useState<Filter>('전체')
  const [q, setQ] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<FridgeItem | null>(null)

  const sorted = useMemo(() => [...fridge.items].sort((a, b) => a.expiresAt.localeCompare(b.expiresAt)), [fridge.items])
  const expired = sorted.filter((i) => daysLeft(i.expiresAt) < 0)
  const expiring = sorted.filter((i) => { const d = daysLeft(i.expiresAt); return d >= 0 && d <= settings.alertDays })
  const cookable = useMemo(() => rankRecipes(fridge.items, 1, settings.alertDays).filter((m) => m.missing.length === 0).length, [fridge.items, settings.alertDays])

  const shown = sorted.filter((i) => {
    if (filter === '임박' && daysLeft(i.expiresAt) > settings.alertDays) return false
    if (STORAGES.includes(filter as Storage) && i.storage !== filter) return false
    if (q && !i.name.includes(q)) return false
    return true
  })
  const groups: { title: string; items: FridgeItem[] }[] = [
    { title: '유통기한 지남', items: shown.filter((i) => daysLeft(i.expiresAt) < 0) },
    { title: `임박 · D-${settings.alertDays} 이내`, items: shown.filter((i) => { const d = daysLeft(i.expiresAt); return d >= 0 && d <= settings.alertDays }) },
    { title: '여유', items: shown.filter((i) => daysLeft(i.expiresAt) > settings.alertDays) },
  ].filter((g) => g.items.length)

  const openNew = () => { setEditing(null); setFormOpen(true) }

  return (
    <div className="space-y-5">
      {/* 요약 히어로 */}
      <div className="relative overflow-hidden rounded-card bg-gradient-to-br from-leaf to-leaf-deep p-5 text-white shadow-[0_16px_32px_-12px_rgba(31,122,68,.55)]">
        <div className="pointer-events-none absolute -right-8 -top-10 size-40 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-12 right-12 size-32 rounded-full bg-white/10" />
        <p className="text-[13px] font-semibold text-white/80">우리집 냉장고에는</p>
        <p className="mt-0.5 text-[28px] font-extrabold leading-none tracking-tight">식재료 {fridge.items.length}개</p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Stat label="임박" value={expiring.length} tone={expiring.length ? 'bg-white/20' : 'bg-white/10'} onClick={() => setFilter('임박')} />
          <Stat label="지남" value={expired.length} tone="bg-white/10" onClick={() => setFilter('전체')} />
          <Stat label="가능한 요리" value={cookable} tone="bg-white/10" onClick={goCook} />
        </div>
      </div>

      {expiring.length + expired.length > 0 && (
        <button onClick={goCook} className="flex w-full items-center gap-3 rounded-card border border-honey/30 bg-honey-soft/70 px-4 py-3.5 text-left transition active:scale-[0.99]">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-honey text-white"><AlarmClock size={20} /></span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-extrabold text-ink">빨리 먹어야 할 재료 {expiring.length + expired.length}개</p>
            <p className="truncate text-xs text-ink-2">{[...expired, ...expiring].slice(0, 4).map((i) => `${i.name} ${dDayLabel(i.expiresAt)}`).join(' · ')}</p>
          </div>
          <span className="flex items-center gap-0.5 text-xs font-bold text-honey">요리 보기<ArrowRight size={14} /></span>
        </button>
      )}

      <div className="flex gap-2">
        <label className="flex flex-1 items-center gap-2 rounded-2xl border border-line bg-paper px-3.5 shadow-card focus-within:border-leaf focus-within:ring-4 focus-within:ring-leaf-soft">
          <Search size={16} className="text-ink-3" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="재료 검색" className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-ink-3" />
        </label>
        <Button onClick={openNew}><Plus size={16} strokeWidth={3} />추가</Button>
      </div>
      <div className="no-scrollbar -mx-5 flex gap-1.5 overflow-x-auto px-5 pb-0.5">
        {(['전체', '임박', ...STORAGES] as Filter[]).map((f) => (
          <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>{f}{f === '임박' && expiring.length > 0 ? ` ${expiring.length}` : ''}</Chip>
        ))}
      </div>

      {fridge.loading ? <Skeleton rows={5} />
        : shown.length === 0 ? (
          <Empty art="fridge" title={fridge.items.length ? '조건에 맞는 재료가 없어요' : '냉장고가 비어 있어요'} desc={fridge.items.length ? '필터나 검색어를 바꿔보세요' : '장 본 식재료를 넣으면 유통기한을 챙겨드리고 요리도 추천해드려요'}
            action={!fridge.items.length && <Button onClick={openNew}><Plus size={16} strokeWidth={3} />첫 재료 넣기</Button>} />
        ) : groups.map((g) => (
          <section key={g.title}>
            <SectionTitle>{g.title} <span className="ml-1 text-ink-3">{g.items.length}</span></SectionTitle>
            <Card className="overflow-hidden">
              <ul className="stagger divide-y divide-line/70">
                {g.items.map((it) => <Row key={it.id} it={it} alertDays={settings.alertDays} onClick={() => { setEditing(it); setFormOpen(true) }} />)}
              </ul>
            </Card>
          </section>
        ))}

      <ItemForm open={formOpen} initial={editing} onClose={() => setFormOpen(false)}
        onSave={(n) => (editing ? fridge.updateItem(editing.id, n) : fridge.addItem(n))}
        onDelete={fridge.removeItem} />
    </div>
  )
}

function Stat({ label, value, tone, onClick }: { label: string; value: number; tone: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`rounded-2xl ${tone} px-3 py-2.5 text-left transition active:scale-95`}>
      <p className="text-[11px] font-semibold text-white/75">{label}</p>
      <p className="text-xl font-extrabold leading-tight tabular-nums">{value}</p>
    </button>
  )
}

function Row({ it, alertDays, onClick }: { it: FridgeItem; alertDays: number; onClick: () => void }) {
  const u = urgency(it.expiresAt, alertDays)
  const total = Math.max(1, daysLeft(it.expiresAt, it.purchasedAt))
  const left = Math.max(0, Math.min(total, daysLeft(it.expiresAt)))
  const ratio = u === 'expired' ? 0 : left / total
  return (
    <li>
      <button onClick={onClick} className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-cream/60 active:bg-cream">
        <IconTile tone={CATEGORY_TONE[it.category]} className={u === 'expired' ? 'opacity-50 grayscale' : ''} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className={`truncate text-[15px] font-bold ${u === 'expired' ? 'text-ink-3 line-through' : 'text-ink'}`}>{it.name}</p>
            <span className="text-xs text-ink-3 tabular-nums">{it.qty}{it.unit}</span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <div className="h-1 w-16 overflow-hidden rounded-full bg-cream-2"><div className={`h-full rounded-full ${urgencyBar[u]}`} style={{ width: `${Math.round(ratio * 100)}%` }} /></div>
            <p className="truncate text-[11px] text-ink-3">{it.storage} · {formatKDate(it.expiresAt)}까지{it.memo ? ` · ${it.memo}` : ''}</p>
          </div>
        </div>
        <Badge className={`${urgencyStyle[u]} min-w-[52px] justify-center`}>{dDayLabel(it.expiresAt)}</Badge>
        <ChevronRight size={16} className="text-ink-3/60" />
      </button>
    </li>
  )
}
