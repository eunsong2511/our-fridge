import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { ChefHat, Cloud, Refrigerator, Settings as SettingsIcon, ShoppingBasket, Smartphone } from 'lucide-react'
import { supabase } from './lib/supabase'
import { localRepo } from './lib/storage/local'
import { makeSupabaseRepo } from './lib/storage/supabase'
import type { Repo } from './lib/storage/types'
import { useFridge } from './hooks/useFridge'
import { loadSettings, saveSettings } from './lib/settings'
import type { Settings } from './lib/types'
import { maybeNotify } from './lib/notify'
import { daysLeft } from './lib/dates'
import { AuthScreen } from './components/AuthScreen'
import { FridgeTab } from './components/FridgeTab'
import { ShoppingTab } from './components/ShoppingTab'
import { RecipesTab } from './components/RecipesTab'
import { SettingsTab } from './components/SettingsTab'

export type Tab = 'fridge' | 'shop' | 'cook' | 'settings'
const TABS = [
  { id: 'fridge', label: '냉장고', icon: Refrigerator },
  { id: 'shop', label: '장보기', icon: ShoppingBasket },
  { id: 'cook', label: '요리', icon: ChefHat },
  { id: 'settings', label: '설정', icon: SettingsIcon },
] as const

export default function App() {
  const [session, setSession] = useState<Session | null | undefined>(supabase ? undefined : null)
  const [localMode, setLocalMode] = useState(() => localStorage.getItem('fridge.localMode') === '1')

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  const repo: Repo | null = useMemo(() => {
    if (supabase && session) return makeSupabaseRepo(supabase, session.user.id)
    if (!supabase || localMode) return localRepo
    return null
  }, [session, localMode])

  if (session === undefined) return <Splash />
  if (!repo) return <AuthScreen onLocal={() => { localStorage.setItem('fridge.localMode', '1'); setLocalMode(true) }} />
  return <Main key={repo.mode + (session?.user.id ?? '')} repo={repo} userEmail={session?.user.email}
    onLogout={async () => { await supabase?.auth.signOut(); localStorage.removeItem('fridge.localMode'); setLocalMode(false) }} />
}

function Splash() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-ink-3">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-leaf text-white shadow-float"><Refrigerator size={28} /></span>
      <p className="text-sm">불러오는 중…</p>
    </div>
  )
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

function Main({ repo, userEmail, onLogout }: { repo: Repo; userEmail?: string; onLogout: () => void }) {
  const fridge = useFridge(repo)
  const [settings, setSettingsState] = useState<Settings>(loadSettings)
  const setSettings = useCallback((s: Settings) => { setSettingsState(s); saveSettings(s) }, [])
  const [tab, setTab] = useState<Tab>(() => { const t = new URLSearchParams(location.search).get('tab') as Tab | null; return t && TABS.some((x) => x.id === t) ? t : 'fridge' })
  const [servings, setServings] = useState(settings.defaultServings)
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const toast = useCallback((m: string) => { setToastMsg(m); setTimeout(() => setToastMsg(null), 3500) }, [])

  useEffect(() => { if (!fridge.loading) maybeNotify(fridge.items, settings, setSettings) }, [fridge.loading, fridge.items, settings, setSettings])

  const expiringCount = fridge.items.filter((i) => daysLeft(i.expiresAt) <= settings.alertDays).length
  const now = new Date()
  const dateLabel = `${now.getMonth() + 1}월 ${now.getDate()}일 ${WEEKDAYS[now.getDay()]}요일`

  return (
    <div className="mx-auto min-h-screen max-w-md">
      <header className="sticky top-0 z-30 bg-cream/85 px-5 pt-4 pb-3 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-leaf text-white shadow-[0_6px_14px_-6px_rgba(46,156,90,.7)]"><Refrigerator size={18} /></span>
            <div className="leading-tight">
              <h1 className="text-[17px] font-extrabold tracking-tight">우리집냉장고</h1>
              <p className="text-[11px] font-medium text-ink-3">{dateLabel}</p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${repo.mode === 'cloud' ? 'bg-sky-soft text-sky' : 'bg-cream-2 text-ink-2'}`}>
            {repo.mode === 'cloud' ? <Cloud size={12} /> : <Smartphone size={12} />}{repo.mode === 'cloud' ? '동기화' : '이 기기'}
          </span>
        </div>
      </header>

      {fridge.error && (
        <div className="mx-5 mt-2 flex items-center justify-between rounded-2xl bg-berry-soft px-4 py-2.5 text-sm text-berry">
          <span>오류: {fridge.error}</span><button className="font-bold underline" onClick={() => fridge.reload()}>다시 시도</button>
        </div>
      )}

      <main key={tab} className="safe-bottom px-5 pt-2 animate-fade-in">
        {tab === 'fridge' && <FridgeTab fridge={fridge} settings={settings} goCook={() => setTab('cook')} />}
        {tab === 'shop' && <ShoppingTab fridge={fridge} toast={toast} />}
        {tab === 'cook' && <RecipesTab fridge={fridge} settings={settings} servings={servings} setServings={setServings} toast={toast} />}
        {tab === 'settings' && <SettingsTab settings={settings} setSettings={setSettings} fridge={fridge} userEmail={userEmail} onLogout={onLogout} toast={toast} />}
      </main>

      {toastMsg && (
        <div className="pointer-events-none fixed inset-x-0 bottom-28 z-40 flex justify-center px-6">
          <div className="animate-toast rounded-2xl bg-ink px-4 py-3 text-sm font-medium text-cream shadow-float">{toastMsg}</div>
        </div>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-30 px-4 pb-[max(env(safe-area-inset-bottom),12px)]">
        <div className="mx-auto flex max-w-md rounded-[26px] border border-line/70 bg-paper/95 p-1.5 shadow-float backdrop-blur-md">
          {TABS.map((t) => {
            const active = tab === t.id
            const Icon = t.icon
            return (
              <button key={t.id} onClick={() => setTab(t.id)} className="relative flex flex-1 flex-col items-center gap-0.5 py-1.5">
                <span className={`relative flex h-8 w-12 items-center justify-center rounded-2xl transition-all duration-200 ${active ? 'bg-leaf-soft text-leaf-deep' : 'text-ink-3'}`}>
                  <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                  {t.id === 'fridge' && expiringCount > 0 && <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-berry px-1 text-[10px] font-extrabold text-white ring-2 ring-paper">{expiringCount}</span>}
                </span>
                <span className={`text-[10.5px] font-bold ${active ? 'text-leaf-deep' : 'text-ink-3'}`}>{t.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
