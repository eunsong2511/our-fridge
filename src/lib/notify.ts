import type { FridgeItem, Settings } from './types'
import { daysLeft, todayStr } from './dates'

export const canNotify = () => typeof window !== 'undefined' && 'Notification' in window

export async function requestNotifyPermission(): Promise<boolean> {
  if (!canNotify()) return false
  if (Notification.permission === 'granted') return true
  const p = await Notification.requestPermission()
  return p === 'granted'
}

/** 하루 한 번, 임박 재료가 있으면 브라우저 알림 */
export function maybeNotify(items: FridgeItem[], settings: Settings, save: (s: Settings) => void) {
  if (!settings.notifyBrowser || !canNotify() || Notification.permission !== 'granted') return
  const today = todayStr()
  if (settings.lastNotifiedOn === today) return
  const soon = items.filter((i) => daysLeft(i.expiresAt) <= settings.alertDays)
  if (soon.length === 0) return
  const names = soon.slice(0, 4).map((i) => i.name).join(', ') + (soon.length > 4 ? ` 외 ${soon.length - 4}개` : '')
  try {
    new Notification('우리집냉장고: 유통기한 임박', { body: `${names} — 빨리 드세요!`, icon: './icon-192.png' })
    save({ ...settings, lastNotifiedOn: today })
  } catch { /* ignore */ }
}
