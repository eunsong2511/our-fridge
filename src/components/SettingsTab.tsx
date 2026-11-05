import { useState } from 'react'
import type { Settings } from '../lib/types'
import type { Fridge } from '../hooks/useFridge'
import { canNotify, requestNotifyPermission } from '../lib/notify'
import { Button, Field, Stepper } from './ui'
import { supabase } from '../lib/supabase'

export function SettingsTab({ settings, setSettings, fridge, userEmail, onLogout, toast }: { settings: Settings; setSettings: (s: Settings) => void; fridge: Fridge; userEmail?: string; onLogout?: () => void; toast: (m: string) => void }) {
  const [busy, setBusy] = useState(false)
  const toggleNotify = async () => {
    if (settings.notifyBrowser) return setSettings({ ...settings, notifyBrowser: false })
    setBusy(true)
    const ok = await requestNotifyPermission()
    setBusy(false)
    if (!ok) return toast('브라우저 알림 권한이 거부됐어요. 브라우저 설정에서 허용해주세요.')
    setSettings({ ...settings, notifyBrowser: true, lastNotifiedOn: undefined })
    toast('알림을 켰어요. 앱을 열 때 하루 한 번 임박 재료를 알려드려요.')
  }
  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ items: fridge.items, shopping: fridge.shopping }, null, 2)], { type: 'application/json' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `our-fridge-${new Date().toISOString().slice(0, 10)}.json`; a.click()
  }
  return (
    <div className="space-y-5">
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="font-bold">알림</h3>
        <div className="flex items-center justify-between">
          <div><p className="text-sm font-medium">임박 기준</p><p className="text-xs text-slate-400">유통기한이 이 일수 이하로 남으면 알림</p></div>
          <Stepper value={settings.alertDays} min={1} max={14} suffix="일" onChange={(v) => setSettings({ ...settings, alertDays: v })} />
        </div>
        <div className="flex items-center justify-between">
          <div><p className="text-sm font-medium">브라우저 알림</p><p className="text-xs text-slate-400">{canNotify() ? '앱을 열 때 하루 한 번 알려드려요' : '이 브라우저는 알림을 지원하지 않아요'}</p></div>
          <button disabled={!canNotify() || busy} onClick={toggleNotify} className={`relative h-7 w-12 rounded-full transition ${settings.notifyBrowser ? 'bg-emerald-600' : 'bg-slate-300'}`} aria-label="브라우저 알림">
            <span className={`absolute top-0.5 size-6 rounded-full bg-white shadow transition ${settings.notifyBrowser ? 'left-5.5' : 'left-0.5'}`} />
          </button>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="font-bold">요리</h3>
        <div className="flex items-center justify-between">
          <div><p className="text-sm font-medium">기본 인분</p><p className="text-xs text-slate-400">요리 탭을 열 때 기본값</p></div>
          <Stepper value={settings.defaultServings} onChange={(v) => setSettings({ ...settings, defaultServings: v })} />
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="font-bold">계정 · 데이터</h3>
        {fridge.loading ? null : supabase ? (
          userEmail ? (
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-medium">{userEmail}</p><p className="text-xs text-emerald-600">☁️ 클라우드 동기화 중</p></div>
              <Button variant="outline" onClick={onLogout}>로그아웃</Button>
            </div>
          ) : <p className="text-sm text-slate-500">📱 이 기기에만 저장 중 (로그인하면 기기 간 동기화)</p>
        ) : (
          <p className="text-sm text-slate-500">📱 이 기기에만 저장 중. Supabase 키를 설정하면 로그인·동기화가 켜져요.</p>
        )}
        <Field label="내보내기"><Button variant="outline" onClick={exportJson}>JSON으로 내려받기</Button></Field>
        <p className="text-xs text-slate-400">식재료 {fridge.items.length}개 · 장보기 {fridge.shopping.length}개 · 레시피 47개 내장</p>
      </section>
    </div>
  )
}
