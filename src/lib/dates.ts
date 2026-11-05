export const todayStr = () => toDateStr(new Date())

export function toDateStr(d: Date) {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return toDateStr(d)
}

/** 오늘 기준 남은 일수. 0 = 오늘까지, 음수 = 지남 */
export function daysLeft(expiresAt: string, from = todayStr()) {
  const a = new Date(from + 'T00:00:00').getTime()
  const b = new Date(expiresAt + 'T00:00:00').getTime()
  return Math.round((b - a) / 86400000)
}

export function dDayLabel(expiresAt: string) {
  const n = daysLeft(expiresAt)
  if (n === 0) return 'D-Day'
  if (n < 0) return `D+${-n}`
  return `D-${n}`
}

export type Urgency = 'expired' | 'urgent' | 'soon' | 'ok'
export function urgency(expiresAt: string, alertDays: number): Urgency {
  const n = daysLeft(expiresAt)
  if (n < 0) return 'expired'
  if (n <= Math.min(1, alertDays)) return 'urgent'
  if (n <= alertDays) return 'soon'
  return 'ok'
}

export function formatKDate(dateStr: string) {
  const [, m, d] = dateStr.split('-')
  return `${Number(m)}월 ${Number(d)}일`
}
