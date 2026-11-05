import { useState } from 'react'
import { Bell, Cloud, Database, Download, LogOut, Smartphone, Sparkles, Utensils } from 'lucide-react'
import type { Settings } from '../lib/types'
import type { Fridge } from '../hooks/useFridge'
import { canNotify, requestNotifyPermission } from '../lib/notify'
import { Button, Card, Stepper } from './ui'
import { supabase } from '../lib/supabase'
import { demoItems, demoShopping } from '../lib/demo'

function RowItem({ title, desc, right }: { title: string; desc?: string; right: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3.5">
      <div className="min-w-0"><p className="text-[15px] font-bold">{title}</p>{desc && <p className="text-xs text-ink-3">{desc}</p>}</div>
      <div className="shrink-0">{right}</div>
    </div>
  )
}
function Head({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return <h3 className="mb-2 flex items-center gap-1.5 px-1 text-[13px] font-extrabold tracking-wide text-ink-2"><Icon size={14} className="text-leaf" />{children}</h3>
}
function Toggle({ on, onClick, disabled }: { on: boolean; onClick: () => void; disabled?: boolean }) {
  return (
    <button disabled={disabled} onClick={onClick} className={`relative h-8 w-14 rounded-full transition-colors ${on ? 'bg-leaf' : 'bg-line'} disabled:opacity-50`} aria-pressed={on}>
      <span className={`absolute top-1 size-6 rounded-full bg-paper shadow transition-all ${on ? 'left-7' : 'left-1'}`} />
    </button>
  )
}

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
  const seed = async () => {
    setBusy(true)
    for (const i of demoItems().reverse()) await fridge.addItem(i)
    for (const s of demoShopping().reverse()) await fridge.addShopping(s)
    setBusy(false)
    toast('샘플 식재료 20개와 장보기 3개를 넣었어요')
  }
  return (
    <div className="space-y-6">
      <section>
        <Head icon={Bell}>알림</Head>
        <Card className="divide-y divide-line/70">
          <RowItem title="임박 기준" desc="남은 일수가 이 이하이면 알림" right={<Stepper value={settings.alertDays} min={1} max={14} suffix="일" onChange={(v) => setSettings({ ...settings, alertDays: v })} />} />
          <RowItem title="브라우저 알림" desc={canNotify() ? '앱을 열 때 하루 한 번' : '이 브라우저는 지원하지 않아요'} right={<Toggle on={settings.notifyBrowser} onClick={toggleNotify} disabled={!canNotify() || busy} />} />
        </Card>
      </section>

      <section>
        <Head icon={Utensils}>요리</Head>
        <Card><RowItem title="기본 인분" desc="요리 탭을 열 때 기본값" right={<Stepper value={settings.defaultServings} onChange={(v) => setSettings({ ...settings, defaultServings: v })} />} /></Card>
      </section>

      <section>
        <Head icon={Database}>계정 · 데이터</Head>
        <Card className="divide-y divide-line/70">
          {supabase && userEmail ? (
            <RowItem title={userEmail} desc="클라우드 동기화 중" right={<Button size="sm" variant="outline" onClick={onLogout}><LogOut size={14} />로그아웃</Button>} />
          ) : (
            <div className="flex items-center gap-3 px-4 py-3.5">
              <span className="flex size-10 items-center justify-center rounded-2xl bg-cream-2 text-ink-2">{supabase ? <Cloud size={18} /> : <Smartphone size={18} />}</span>
              <div><p className="text-[15px] font-bold">이 기기에만 저장 중</p><p className="text-xs text-ink-3">{supabase ? '로그인하면 기기 간 동기화돼요' : 'Supabase 키를 설정하면 로그인·동기화가 켜져요'}</p></div>
            </div>
          )}
          <RowItem title="내보내기" desc="JSON 파일로 백업" right={<Button size="sm" variant="outline" onClick={exportJson}><Download size={14} />내려받기</Button>} />
          <RowItem title="샘플 데이터 넣기" desc="앱을 둘러보고 싶을 때" right={<Button size="sm" variant="soft" disabled={busy} onClick={seed}><Sparkles size={14} />채우기</Button>} />
        </Card>
        <p className="mt-2 px-1 text-[11px] text-ink-3">식재료 {fridge.items.length}개 · 장보기 {fridge.shopping.length}개 · 내장 레시피 47개</p>
      </section>
    </div>
  )
}
