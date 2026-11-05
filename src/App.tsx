import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
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

type Tab = 'fridge' | 'shop' | 'cook' | 'settings'
const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'fridge', label: '냉장고', icon: '🧊' },
  { id: 'shop', label: '장보기', icon: '🛒' },
  { id: 'cook', label: '요리', icon: '🍳' },
  { id: 'settings', label: '설정', icon: '⚙️' },
]

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
  return <div className="flex min-h-screen items-center justify-center text-slate-400">불러오는 중…</div>
}

function Main({ repo, userEmail, onLogout }: { repo: Repo; userEmail?: string; onLogout: () => void }) {
  const fridge = useFridge(repo)
  const [settings, setSettingsState] = useState<Settings>(loadSettings)
  const setSettings = useCallback((s: Settings) => { setSettingsState(s); saveSettings(s) }, [])
  const [tab, setTab] = useState<Tab>('fridge')
  const [servings, setServings] = useState(settings.defaultServings)
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const toast = useCallback((m: string) => { setToastMsg(m); setTimeout(() => setToastMsg(null), 3500) }, [])

  useEffect(() => { if (!fridge.loading) maybeNotify(fridge.items, settings, setSettings) }, [fridge.loading, fridge.items, settings, setSettings])

  const expiringCount = fridge.items.filter((i) => daysLeft(i.expiresAt) <= settings.alertDays).length

  return (
    <div className="mx-auto min-h-screen max-w-md">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">🧊 우리집냉장고</h1>
          <span className="text-xs text-slate-400">{repo.mode === 'cloud' ? '☁️ 동기화' : '📱 이 기기'}</span>
        </div>
      </header>

      {fridge.error && (
        <div className="mx-4 mt-3 flex items-center justify-between rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          <span>오류: {fridge.error}</span><button className="underline" onClick={() => fridge.reload()}>다시 시도</button>
        </div>
      )}

      <main className="safe-bottom px-4 pt-4">
        {tab === 'fridge' && <FridgeTab fridge={fridge} settings={settings} />}
        {tab === 'shop' && <ShoppingTab fridge={fridge} toast={toast} />}
        {tab === 'cook' && <RecipesTab fridge={fridge} settings={settings} servings={servings} setServings={setServings} toast={toast} />}
        {tab === 'settings' && <SettingsTab settings={settings} setSettings={setSettings} fridge={fridge} userEmail={userEmail} onLogout={onLogout} toast={toast} />}
      </main>

      {toastMsg && (
        <div className="fixed inset-x-0 bottom-24 z-40 flex justify-center px-4">
          <div className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm text-white shadow-lg">{toastMsg}</div>
        </div>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto flex max-w-md">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] ${tab === t.id ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}>
              <span className="text-xl">{t.icon}</span>{t.label}
              {t.id === 'fridge' && expiringCount > 0 && <span className="absolute right-[calc(50%-18px)] top-1 rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">{expiringCount}</span>}
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
