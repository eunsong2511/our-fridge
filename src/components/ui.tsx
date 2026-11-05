import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import type { Urgency } from '../lib/dates'

export const urgencyStyle: Record<Urgency, string> = {
  expired: 'bg-cream-2 text-ink-3',
  urgent: 'bg-berry-soft text-berry',
  soon: 'bg-honey-soft text-honey',
  ok: 'bg-leaf-soft text-leaf-deep',
}
export const urgencyBar: Record<Urgency, string> = { expired: 'bg-ink-3', urgent: 'bg-berry', soon: 'bg-honey', ok: 'bg-leaf' }

export function Badge({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold tabular-nums ${className}`}>{children}</span>
}

type Variant = 'primary' | 'accent' | 'ghost' | 'danger' | 'outline' | 'soft'
export function Button({ children, variant = 'primary', size = 'md', className = '', ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: 'sm' | 'md' | 'lg' }) {
  const v: Record<Variant, string> = {
    primary: 'bg-leaf text-white shadow-[0_6px_16px_-6px_rgba(46,156,90,.6)] hover:bg-leaf-deep',
    accent: 'bg-tangerine text-white shadow-[0_6px_16px_-6px_rgba(242,134,43,.6)] hover:bg-tangerine-deep',
    soft: 'bg-leaf-soft text-leaf-deep hover:bg-leaf-soft/70',
    ghost: 'bg-transparent text-ink-2 hover:bg-cream-2',
    outline: 'border border-line bg-paper text-ink hover:bg-cream',
    danger: 'bg-berry-soft text-berry hover:bg-berry-soft/70',
  }
  const s = { sm: 'px-3 py-1.5 text-xs rounded-xl', md: 'px-4 py-2.5 text-sm rounded-2xl', lg: 'px-5 py-3.5 text-[15px] rounded-2xl' }[size]
  return <button className={`inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap font-bold transition-all duration-150 active:scale-[0.97] disabled:opacity-50 disabled:shadow-none ${v[variant]} ${s} ${className}`} {...rest}>{children}</button>
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-ink-2">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-ink-3">{hint}</span>}
    </label>
  )
}

export const inputCls = 'w-full rounded-2xl border border-line bg-paper px-3.5 py-3 text-[15px] text-ink outline-none transition placeholder:text-ink-3 focus:border-leaf focus:ring-4 focus:ring-leaf-soft'

export function Segmented<T extends string>({ value, options, onChange }: { value: T; options: T[]; onChange: (v: T) => void }) {
  return (
    <div className="flex rounded-2xl bg-cream-2 p-1">
      {options.map((o) => (
        <button key={o} type="button" onClick={() => onChange(o)}
          className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-all ${o === value ? 'bg-paper text-ink shadow-sm' : 'text-ink-3'}`}>{o}</button>
      ))}
    </div>
  )
}

export function Chip({ active, children, onClick, tone = 'dark' }: { active: boolean; children: ReactNode; onClick: () => void; tone?: 'dark' | 'leaf' }) {
  const on = tone === 'dark' ? 'bg-ink text-cream' : 'bg-leaf text-white'
  return (
    <button onClick={onClick} className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-all active:scale-95 ${active ? on : 'bg-paper text-ink-2 border border-line'}`}>{children}</button>
  )
}

export function Stepper({ value, min = 1, max = 10, onChange, suffix = '인분' }: { value: number; min?: number; max?: number; onChange: (v: number) => void; suffix?: string }) {
  const b = 'flex size-9 items-center justify-center rounded-xl bg-paper text-lg font-bold text-ink-2 shadow-sm transition active:scale-90 disabled:opacity-30'
  return (
    <div className="inline-flex items-center gap-1 rounded-2xl bg-cream-2 p-1">
      <button type="button" className={b} disabled={value <= min} onClick={() => onChange(value - 1)}>−</button>
      <span className="min-w-14 text-center text-sm font-bold tabular-nums">{value}{suffix}</span>
      <button type="button" className={b} disabled={value >= max} onClick={() => onChange(value + 1)}>+</button>
    </div>
  )
}

export function Sheet({ open, onClose, title, children, subtitle }: { open: boolean; onClose: () => void; title: string; subtitle?: string; children: ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-[2px] animate-fade-in sm:items-center" onClick={onClose}>
      <div className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-[28px] bg-cream shadow-sheet animate-sheet-in sm:rounded-[28px]" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 bg-cream/95 px-5 pt-3 pb-3 backdrop-blur">
          <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-line sm:hidden" />
          <div className="flex items-start justify-between gap-3">
            <div><h2 className="text-xl font-extrabold tracking-tight">{title}</h2>{subtitle && <p className="mt-0.5 text-sm text-ink-2">{subtitle}</p>}</div>
            <button className="rounded-full bg-cream-2 p-2 text-ink-2 transition hover:bg-line" onClick={onClose} aria-label="닫기"><X size={16} /></button>
          </div>
        </div>
        <div className="px-5 pb-6">{children}</div>
      </div>
    </div>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-card bg-paper shadow-card ${className}`}>{children}</div>
}

export function SectionTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="mb-2.5 flex items-center justify-between px-1">
      <h3 className="text-[13px] font-extrabold tracking-wide text-ink-2">{children}</h3>
      {right}
    </div>
  )
}

export function Skeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-card bg-paper p-4 shadow-card">
          <div className="size-11 animate-pulse rounded-2xl bg-cream-2" />
          <div className="flex-1 space-y-2"><div className="h-3.5 w-1/2 animate-pulse rounded bg-cream-2" /><div className="h-3 w-3/4 animate-pulse rounded bg-cream-2" /></div>
        </div>
      ))}
    </div>
  )
}

type Art = 'fridge' | 'basket' | 'pot'
function Illustration({ kind }: { kind: Art }) {
  if (kind === 'basket') return (
    <svg viewBox="0 0 120 100" className="h-28 w-32"><ellipse cx="60" cy="92" rx="40" ry="5" fill="#EAE4D6"/><path d="M22 44h76l-8 40H30z" fill="#F2862B"/><path d="M22 44h76l-3 14H25z" fill="#D66E16"/><path d="M40 44c0-18 8-28 20-28s20 10 20 28" fill="none" stroke="#A0663A" strokeWidth="5" strokeLinecap="round"/><circle cx="50" cy="38" r="9" fill="#DD4F4F"/><circle cx="68" cy="34" r="10" fill="#2E9C5A"/><rect x="60" y="20" width="4" height="10" rx="2" fill="#1F7A44"/></svg>)
  if (kind === 'pot') return (
    <svg viewBox="0 0 120 100" className="h-28 w-32"><ellipse cx="60" cy="92" rx="40" ry="5" fill="#EAE4D6"/><rect x="24" y="44" width="72" height="42" rx="12" fill="#3C86C6"/><rect x="18" y="40" width="84" height="10" rx="5" fill="#2B6AA3"/><rect x="36" y="30" width="48" height="12" rx="6" fill="#E3EFFA"/><circle cx="60" cy="30" r="5" fill="#2B6AA3"/><path d="M48 22c0-6 4-6 4-12M60 20c0-6 4-6 4-12M72 22c0-6 4-6 4-12" stroke="#9AA69F" strokeWidth="3" strokeLinecap="round" fill="none"/></svg>)
  return (
    <svg viewBox="0 0 120 100" className="h-28 w-32"><ellipse cx="60" cy="94" rx="40" ry="5" fill="#EAE4D6"/><rect x="32" y="6" width="56" height="84" rx="12" fill="#2E9C5A"/><rect x="38" y="12" width="44" height="30" rx="7" fill="#E3F3E8"/><rect x="38" y="46" width="44" height="38" rx="7" fill="#F2F9F4"/><rect x="42" y="18" width="4" height="12" rx="2" fill="#2E9C5A"/><rect x="42" y="54" width="4" height="18" rx="2" fill="#2E9C5A"/><circle cx="90" cy="22" r="11" fill="#F2862B"/><path d="M90 16v12M84 22h12" stroke="#fff" strokeWidth="3" strokeLinecap="round"/></svg>)
}

export function Empty({ art = 'fridge', title, desc, action }: { art?: Art; title: string; desc?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center py-12 text-center animate-fade-in">
      <Illustration kind={art} />
      <p className="mt-4 text-[15px] font-extrabold text-ink">{title}</p>
      {desc && <p className="mt-1 max-w-60 text-sm leading-relaxed text-ink-3">{desc}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
