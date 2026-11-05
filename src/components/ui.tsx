import type { ReactNode } from 'react'
import type { Urgency } from '../lib/dates'

export const urgencyStyle: Record<Urgency, string> = {
  expired: 'bg-slate-200 text-slate-600 line-through',
  urgent: 'bg-red-100 text-red-700',
  soon: 'bg-amber-100 text-amber-700',
  ok: 'bg-emerald-50 text-emerald-700',
}

export function Badge({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${className}`}>{children}</span>
}

export function Button({ children, variant = 'primary', className = '', ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger' | 'outline' }) {
  const v = {
    primary: 'bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-emerald-300',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
    outline: 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50',
    danger: 'bg-red-50 text-red-700 hover:bg-red-100',
  }[variant]
  return <button className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition active:scale-[0.98] disabled:opacity-60 ${v} ${className}`} {...rest}>{children}</button>
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-500">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  )
}

export const inputCls = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-[15px] outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'

export function Segmented<T extends string>({ value, options, onChange }: { value: T; options: T[]; onChange: (v: T) => void }) {
  return (
    <div className="flex rounded-xl bg-slate-100 p-1">
      {options.map((o) => (
        <button key={o} type="button" onClick={() => onChange(o)}
          className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition ${o === value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>{o}</button>
      ))}
    </div>
  )
}

export function Stepper({ value, min = 1, max = 10, onChange, suffix = '인분' }: { value: number; min?: number; max?: number; onChange: (v: number) => void; suffix?: string }) {
  return (
    <div className="inline-flex items-center rounded-xl border border-slate-300 bg-white">
      <button type="button" className="px-3 py-1.5 text-lg text-slate-600 disabled:opacity-30" disabled={value <= min} onClick={() => onChange(value - 1)}>−</button>
      <span className="min-w-14 text-center text-sm font-semibold">{value}{suffix}</span>
      <button type="button" className="px-3 py-1.5 text-lg text-slate-600 disabled:opacity-30" disabled={value >= max} onClick={() => onChange(value + 1)}>+</button>
    </div>
  )
}

export function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <div className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">{title}</h2>
          <button className="rounded-full p-1 text-slate-400 hover:bg-slate-100" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Empty({ icon, title, desc }: { icon: string; title: string; desc?: string }) {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <div className="text-5xl">{icon}</div>
      <p className="mt-3 font-semibold text-slate-700">{title}</p>
      {desc && <p className="mt-1 text-sm text-slate-400">{desc}</p>}
    </div>
  )
}
