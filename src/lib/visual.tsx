import { Apple, Beef, Carrot, ChefHat, CookingPot, Croissant, Drumstick, Egg, EggFried, Fish, Flame, Leaf, Package, Salad, Soup, Sparkles, Utensils, Wheat, type LucideIcon } from 'lucide-react'
import type { Category } from '../data/ingredients'

export interface Tone { bg: string; fg: string; icon: LucideIcon }

export const CATEGORY_TONE: Record<Category, Tone> = {
  '채소': { bg: 'bg-leaf-soft', fg: 'text-leaf-deep', icon: Carrot },
  '과일': { bg: 'bg-rose-soft', fg: 'text-rose', icon: Apple },
  '육류': { bg: 'bg-berry-soft', fg: 'text-berry', icon: Beef },
  '해산물': { bg: 'bg-sky-soft', fg: 'text-sky', icon: Fish },
  '달걀/유제품': { bg: 'bg-butter-soft', fg: 'text-butter', icon: Egg },
  '곡물/면': { bg: 'bg-honey-soft', fg: 'text-honey', icon: Wheat },
  '두부/가공': { bg: 'bg-grape-soft', fg: 'text-grape', icon: Package },
  '양념/소스': { bg: 'bg-cocoa-soft', fg: 'text-cocoa', icon: Sparkles },
  '기타': { bg: 'bg-cream-2', fg: 'text-ink-2', icon: Package },
}

const TAG_TONE: Record<string, Tone> = {
  '국/찌개': { bg: 'bg-honey-soft', fg: 'text-honey', icon: CookingPot },
  '밥': { bg: 'bg-butter-soft', fg: 'text-butter', icon: Utensils },
  '면': { bg: 'bg-sky-soft', fg: 'text-sky', icon: Soup },
  '메인': { bg: 'bg-berry-soft', fg: 'text-berry', icon: Drumstick },
  '밥반찬': { bg: 'bg-leaf-soft', fg: 'text-leaf-deep', icon: Salad },
  '전/부침': { bg: 'bg-tangerine-soft', fg: 'text-tangerine-deep', icon: Flame },
  '분식': { bg: 'bg-tangerine-soft', fg: 'text-tangerine-deep', icon: Flame },
  '달걀': { bg: 'bg-butter-soft', fg: 'text-butter', icon: EggFried },
  '아침': { bg: 'bg-cocoa-soft', fg: 'text-cocoa', icon: Croissant },
  '간식': { bg: 'bg-cocoa-soft', fg: 'text-cocoa', icon: Croissant },
  '나물': { bg: 'bg-leaf-soft', fg: 'text-leaf-deep', icon: Leaf },
}
export const recipeTone = (tags: string[]): Tone => {
  for (const t of tags) if (TAG_TONE[t]) return TAG_TONE[t]
  return { bg: 'bg-leaf-soft', fg: 'text-leaf-deep', icon: ChefHat }
}

export function IconTile({ tone, size = 'md', className = '' }: { tone: Tone; size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const Icon = tone.icon
  const s = { sm: 'size-9 rounded-xl', md: 'size-11 rounded-2xl', lg: 'size-14 rounded-2xl' }[size]
  const i = { sm: 18, md: 22, lg: 28 }[size]
  return <span className={`inline-flex shrink-0 items-center justify-center ${s} ${tone.bg} ${tone.fg} ${className}`}><Icon size={i} strokeWidth={2.2} /></span>
}
