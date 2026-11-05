import { useMemo, useState } from 'react'
import type { Fridge } from '../hooks/useFridge'
import type { FridgeItem, Settings } from '../lib/types'
import { dDayLabel, daysLeft, formatKDate, urgency } from '../lib/dates'
import { STORAGES, type Storage } from '../data/ingredients'
import { ItemForm } from './ItemForm'
import { Badge, Button, Empty, urgencyStyle } from './ui'

type Filter = '전체' | Storage | '임박'

export function FridgeTab({ fridge, settings }: { fridge: Fridge; settings: Settings }) {
  const [filter, setFilter] = useState<Filter>('전체')
  const [q, setQ] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<FridgeItem | null>(null)

  const sorted = useMemo(() => [...fridge.items].sort((a, b) => a.expiresAt.localeCompare(b.expiresAt)), [fridge.items])
  const expiring = sorted.filter((i) => daysLeft(i.expiresAt) <= settings.alertDays)
  const shown = sorted.filter((i) => {
    if (filter === '임박' && daysLeft(i.expiresAt) > settings.alertDays) return false
    if (STORAGES.includes(filter as Storage) && i.storage !== filter) return false
    if (q && !i.name.includes(q)) return false
    return true
  })

  const groups: { title: string; items: FridgeItem[] }[] = [
    { title: '유통기한 지남', items: shown.filter((i) => daysLeft(i.expiresAt) < 0) },
    { title: `임박 (D-${settings.alertDays} 이내)`, items: shown.filter((i) => { const d = daysLeft(i.expiresAt); return d >= 0 && d <= settings.alertDays }) },
    { title: '여유', items: shown.filter((i) => daysLeft(i.expiresAt) > settings.alertDays) },
  ].filter((g) => g.items.length)

  return (
    <div className="space-y-4">
      {expiring.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-bold text-amber-800">⏰ 빨리 먹어야 할 재료 {expiring.length}개</p>
          <p className="mt-1 text-sm text-amber-700">
            {expiring.slice(0, 5).map((i) => `${i.name}(${dDayLabel(i.expiresAt)})`).join(', ')}{expiring.length > 5 ? ' …' : ''}
          </p>
          <p className="mt-2 text-xs text-amber-600">요리 탭에서 임박 재료를 쓰는 요리를 먼저 보여드려요.</p>
        </div>
      )}

      <div className="flex gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="재료 검색"
          className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500" />
        <Button onClick={() => { setEditing(null); setFormOpen(true) }}>＋ 추가</Button>
      </div>
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {(['전체', '임박', ...STORAGES] as Filter[]).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`shrink-0 rounded-full px-3 py-1 text-sm ${filter === f ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
            {f}{f === '임박' && expiring.length > 0 ? ` ${expiring.length}` : ''}
          </button>
        ))}
      </div>

      {fridge.loading ? <p className="py-10 text-center text-sm text-slate-400">불러오는 중…</p>
        : shown.length === 0 ? <Empty icon="🧊" title={fridge.items.length ? '조건에 맞는 재료가 없어요' : '냉장고가 비어 있어요'} desc={fridge.items.length ? undefined : '＋ 추가 버튼으로 장 본 식재료를 넣어보세요'} />
        : groups.map((g) => (
          <section key={g.title}>
            <h3 className="mb-2 text-xs font-bold tracking-wide text-slate-400">{g.title} · {g.items.length}</h3>
            <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {g.items.map((it) => {
                const u = urgency(it.expiresAt, settings.alertDays)
                return (
                  <li key={it.id}>
                    <button onClick={() => { setEditing(it); setFormOpen(true) }} className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-50">
                      <Badge className={`${urgencyStyle[u]} min-w-14 justify-center`}>{dDayLabel(it.expiresAt)}</Badge>
                      <div className="min-w-0 flex-1">
                        <p className={`truncate font-medium ${u === 'expired' ? 'text-slate-400 line-through' : ''}`}>{it.name}</p>
                        <p className="text-xs text-slate-400">{it.qty}{it.unit} · {it.storage} · ~{formatKDate(it.expiresAt)}{it.memo ? ` · ${it.memo}` : ''}</p>
                      </div>
                      <span className="text-slate-300">›</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}

      <ItemForm open={formOpen} initial={editing} onClose={() => setFormOpen(false)}
        onSave={(n) => (editing ? fridge.updateItem(editing.id, n) : fridge.addItem(n))}
        onDelete={fridge.removeItem} />
    </div>
  )
}
