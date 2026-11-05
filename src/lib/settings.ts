import { DEFAULT_SETTINGS, type Settings } from './types'
const KEY = 'fridge.settings.v1'
export function loadSettings(): Settings {
  try { return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(KEY) ?? '{}') } } catch { return DEFAULT_SETTINGS }
}
export function saveSettings(s: Settings) {
  try { localStorage.setItem(KEY, JSON.stringify(s)) } catch { /* ignore */ }
}
