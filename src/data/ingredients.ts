export type Category =
  | '채소' | '과일' | '육류' | '해산물' | '달걀/유제품' | '곡물/면' | '두부/가공' | '양념/소스' | '기타'
export type Storage = '냉장' | '냉동' | '실온'

export interface Ingredient {
  id: string
  name: string
  aliases?: string[]
  category: Category
  unit: string                 // 기본 단위
  shelf: Partial<Record<Storage, number>> // 보관 방법별 권장 보관일
  defaultStorage: Storage
  staple?: boolean             // 기본 상비 재료(식재료 추천에 활용)
}

export const CATEGORIES: Category[] = [
  '채소', '과일', '육류', '해산물', '달걀/유제품', '곡물/면', '두부/가공', '양념/소스', '기타',
]
export const STORAGES: Storage[] = ['냉장', '냉동', '실온']

const V = (id: string, name: string, unit: string, fridge: number, extra: Partial<Ingredient> = {}): Ingredient =>
  ({ id, name, category: '채소', unit, shelf: { 냉장: fridge, 냉동: 90 }, defaultStorage: '냉장', ...extra })

export const INGREDIENTS: Ingredient[] = [
  // 채소
  V('onion', '양파', '개', 21, { shelf: { 냉장: 21, 실온: 30 }, aliases: ['양파'], staple: true }),
  V('green_onion', '대파', '대', 7, { aliases: ['파', '쪽파', '실파'], staple: true }),
  V('garlic', '마늘', '쪽', 30, { aliases: ['다진마늘', '다진 마늘', '깐마늘'], shelf: { 냉장: 30, 냉동: 180 }, staple: true }),
  V('potato', '감자', '개', 21, { shelf: { 냉장: 21, 실온: 14 }, defaultStorage: '실온' }),
  V('sweet_potato', '고구마', '개', 14, { shelf: { 실온: 14, 냉장: 10 }, defaultStorage: '실온' }),
  V('carrot', '당근', '개', 21),
  V('cabbage', '양배추', '개', 14),
  V('napa_cabbage', '배추', '포기', 10, { aliases: ['알배추'] }),
  V('zucchini', '애호박', '개', 7, { aliases: ['호박'] }),
  V('cucumber', '오이', '개', 7),
  V('spinach', '시금치', 'g', 4),
  V('bean_sprout', '콩나물', 'g', 3, { aliases: ['숙주', '숙주나물'] }),
  V('mushroom', '버섯', 'g', 5, { aliases: ['느타리버섯', '표고버섯', '팽이버섯', '새송이버섯', '양송이버섯', '느타리', '표고', '팽이', '새송이', '양송이'] }),
  V('tomato', '토마토', '개', 7, { aliases: ['방울토마토'] }),
  V('lettuce', '상추', 'g', 5, { aliases: ['양상추', '쌈채소'] }),
  V('bell_pepper', '파프리카', '개', 10, { aliases: ['피망'] }),
  V('chili', '고추', '개', 10, { aliases: ['청양고추', '풋고추', '홍고추'] }),
  V('radish', '무', '개', 14),
  V('broccoli', '브로콜리', '개', 7),
  V('eggplant', '가지', '개', 7),
  V('kimchi', '김치', 'g', 60, { category: '두부/가공', aliases: ['배추김치', '묵은지', '신김치'], staple: true }),
  V('perilla', '깻잎', '장', 5),
  V('ginger', '생강', 'g', 21, { aliases: ['다진생강'] }),
  V('corn', '옥수수', '개', 5, { aliases: ['옥수수캔', '스위트콘'] }),
  V('avocado', '아보카도', '개', 5, { category: '과일' }),
  // 과일
  { id: 'apple', name: '사과', category: '과일', unit: '개', shelf: { 냉장: 30, 실온: 7 }, defaultStorage: '냉장' },
  { id: 'banana', name: '바나나', category: '과일', unit: '개', shelf: { 실온: 5, 냉장: 7 }, defaultStorage: '실온' },
  { id: 'lemon', name: '레몬', category: '과일', unit: '개', shelf: { 냉장: 21 }, defaultStorage: '냉장' },
  { id: 'strawberry', name: '딸기', category: '과일', unit: 'g', shelf: { 냉장: 3, 냉동: 90 }, defaultStorage: '냉장' },
  { id: 'grape', name: '포도', category: '과일', unit: 'g', shelf: { 냉장: 7 }, defaultStorage: '냉장' },
  { id: 'orange', name: '오렌지', category: '과일', unit: '개', shelf: { 냉장: 21, 실온: 7 }, defaultStorage: '냉장', aliases: ['귤', '감귤'] },
  // 육류
  { id: 'pork', name: '돼지고기', category: '육류', unit: 'g', shelf: { 냉장: 3, 냉동: 120 }, defaultStorage: '냉장', aliases: ['삼겹살', '목살', '앞다리살', '돼지고기 앞다리', '다진돼지고기', '돼지 다짐육'] },
  { id: 'beef', name: '소고기', category: '육류', unit: 'g', shelf: { 냉장: 3, 냉동: 180 }, defaultStorage: '냉장', aliases: ['쇠고기', '국거리', '불고기감', '다진소고기', '소 다짐육', '등심', '안심', '차돌박이'] },
  { id: 'chicken', name: '닭고기', category: '육류', unit: 'g', shelf: { 냉장: 2, 냉동: 120 }, defaultStorage: '냉장', aliases: ['닭가슴살', '닭다리', '닭', '닭봉', '닭안심', '닭다리살'] },
  { id: 'bacon', name: '베이컨', category: '육류', unit: '장', shelf: { 냉장: 7, 냉동: 30 }, defaultStorage: '냉장' },
  { id: 'ham', name: '햄', category: '두부/가공', unit: 'g', shelf: { 냉장: 7, 냉동: 30 }, defaultStorage: '냉장', aliases: ['스팸', '소시지', '비엔나', '런천미트'] },
  // 해산물
  { id: 'shrimp', name: '새우', category: '해산물', unit: '마리', shelf: { 냉장: 1, 냉동: 90 }, defaultStorage: '냉동', aliases: ['칵테일새우', '냉동새우'] },
  { id: 'squid', name: '오징어', category: '해산물', unit: '마리', shelf: { 냉장: 1, 냉동: 90 }, defaultStorage: '냉동' },
  { id: 'tuna_can', name: '참치캔', category: '두부/가공', unit: '캔', shelf: { 실온: 365 }, defaultStorage: '실온', aliases: ['참치'] },
  { id: 'fish_cake', name: '어묵', category: '두부/가공', unit: 'g', shelf: { 냉장: 7, 냉동: 60 }, defaultStorage: '냉장', aliases: ['오뎅'] },
  { id: 'clam', name: '바지락', category: '해산물', unit: 'g', shelf: { 냉장: 1, 냉동: 60 }, defaultStorage: '냉장', aliases: ['조개', '모시조개'] },
  { id: 'mackerel', name: '고등어', category: '해산물', unit: '마리', shelf: { 냉장: 1, 냉동: 60 }, defaultStorage: '냉동', aliases: ['간고등어', '고등어살'] },
  { id: 'dried_anchovy', name: '멸치', category: '해산물', unit: 'g', shelf: { 냉장: 90, 냉동: 365 }, defaultStorage: '냉동', aliases: ['국물멸치', '잔멸치', '다시멸치'] },
  { id: 'seaweed', name: '김', category: '기타', unit: '장', shelf: { 실온: 90 }, defaultStorage: '실온', aliases: ['김밥김', '조미김'] },
  { id: 'miyeok', name: '미역', category: '기타', unit: 'g', shelf: { 실온: 365 }, defaultStorage: '실온', aliases: ['건미역'] },
  // 달걀/유제품
  { id: 'egg', name: '달걀', category: '달걀/유제품', unit: '개', shelf: { 냉장: 30 }, defaultStorage: '냉장', aliases: ['계란'], staple: true },
  { id: 'milk', name: '우유', category: '달걀/유제품', unit: 'ml', shelf: { 냉장: 7 }, defaultStorage: '냉장' },
  { id: 'cheese', name: '치즈', category: '달걀/유제품', unit: '장', shelf: { 냉장: 21 }, defaultStorage: '냉장', aliases: ['슬라이스치즈', '모짜렐라', '모짜렐라치즈', '체다치즈', '피자치즈'] },
  { id: 'butter', name: '버터', category: '달걀/유제품', unit: 'g', shelf: { 냉장: 60, 냉동: 180 }, defaultStorage: '냉장' },
  { id: 'yogurt', name: '요거트', category: '달걀/유제품', unit: '개', shelf: { 냉장: 10 }, defaultStorage: '냉장', aliases: ['요구르트', '그릭요거트'] },
  { id: 'cream', name: '생크림', category: '달걀/유제품', unit: 'ml', shelf: { 냉장: 5 }, defaultStorage: '냉장', aliases: ['휘핑크림', '우유크림'] },
  // 곡물/면
  { id: 'rice', name: '쌀', category: '곡물/면', unit: 'g', shelf: { 실온: 180 }, defaultStorage: '실온', aliases: ['백미', '밥', '햇반', '즉석밥'], staple: true },
  { id: 'ramen', name: '라면', category: '곡물/면', unit: '봉', shelf: { 실온: 150 }, defaultStorage: '실온' },
  { id: 'noodle', name: '소면', category: '곡물/면', unit: 'g', shelf: { 실온: 365 }, defaultStorage: '실온', aliases: ['국수', '중면'] },
  { id: 'pasta', name: '파스타면', category: '곡물/면', unit: 'g', shelf: { 실온: 365 }, defaultStorage: '실온', aliases: ['스파게티', '스파게티면', '파스타'] },
  { id: 'udon', name: '우동면', category: '곡물/면', unit: '개', shelf: { 냉장: 14, 냉동: 90 }, defaultStorage: '냉장', aliases: ['우동'] },
  { id: 'rice_cake', name: '떡', category: '곡물/면', unit: 'g', shelf: { 냉장: 5, 냉동: 90 }, defaultStorage: '냉장', aliases: ['떡볶이떡', '떡국떡', '가래떡'] },
  { id: 'flour', name: '밀가루', category: '곡물/면', unit: 'g', shelf: { 실온: 240 }, defaultStorage: '실온', aliases: ['부침가루', '튀김가루'] },
  { id: 'bread', name: '식빵', category: '곡물/면', unit: '장', shelf: { 실온: 4, 냉동: 30 }, defaultStorage: '실온', aliases: ['빵', '모닝빵', '바게트'] },
  { id: 'tortilla', name: '또띠아', category: '곡물/면', unit: '장', shelf: { 냉장: 14, 냉동: 60 }, defaultStorage: '냉장' },
  { id: 'dumpling', name: '만두', category: '두부/가공', unit: '개', shelf: { 냉동: 180, 냉장: 3 }, defaultStorage: '냉동', aliases: ['냉동만두'] },
  // 두부/가공
  { id: 'tofu', name: '두부', category: '두부/가공', unit: '모', shelf: { 냉장: 5 }, defaultStorage: '냉장', aliases: ['순두부', '연두부'] },
  { id: 'curry_roux', name: '카레가루', category: '양념/소스', unit: 'g', shelf: { 실온: 365 }, defaultStorage: '실온', aliases: ['카레', '고형카레', '카레루'] },
  // 양념/소스 (상비)
  { id: 'soy_sauce', name: '간장', category: '양념/소스', unit: '큰술', shelf: { 실온: 365 }, defaultStorage: '실온', aliases: ['진간장', '국간장', '양조간장'], staple: true },
  { id: 'gochujang', name: '고추장', category: '양념/소스', unit: '큰술', shelf: { 냉장: 365 }, defaultStorage: '냉장', staple: true },
  { id: 'doenjang', name: '된장', category: '양념/소스', unit: '큰술', shelf: { 냉장: 365 }, defaultStorage: '냉장', staple: true },
  { id: 'gochugaru', name: '고춧가루', category: '양념/소스', unit: '큰술', shelf: { 냉동: 365, 냉장: 180 }, defaultStorage: '냉동', staple: true },
  { id: 'sugar', name: '설탕', category: '양념/소스', unit: '큰술', shelf: { 실온: 730 }, defaultStorage: '실온', staple: true },
  { id: 'salt', name: '소금', category: '양념/소스', unit: '작은술', shelf: { 실온: 1000 }, defaultStorage: '실온', staple: true },
  { id: 'pepper', name: '후추', category: '양념/소스', unit: '작은술', shelf: { 실온: 730 }, defaultStorage: '실온', staple: true },
  { id: 'sesame_oil', name: '참기름', category: '양념/소스', unit: '큰술', shelf: { 실온: 365 }, defaultStorage: '실온', staple: true },
  { id: 'cooking_oil', name: '식용유', category: '양념/소스', unit: '큰술', shelf: { 실온: 365 }, defaultStorage: '실온', aliases: ['올리브오일', '올리브유', '카놀라유', '포도씨유'], staple: true },
  { id: 'vinegar', name: '식초', category: '양념/소스', unit: '큰술', shelf: { 실온: 730 }, defaultStorage: '실온' },
  { id: 'mayo', name: '마요네즈', category: '양념/소스', unit: '큰술', shelf: { 냉장: 90 }, defaultStorage: '냉장' },
  { id: 'ketchup', name: '케첩', category: '양념/소스', unit: '큰술', shelf: { 냉장: 180 }, defaultStorage: '냉장' },
  { id: 'oyster_sauce', name: '굴소스', category: '양념/소스', unit: '큰술', shelf: { 냉장: 180 }, defaultStorage: '냉장' },
  { id: 'mirin', name: '맛술', category: '양념/소스', unit: '큰술', shelf: { 실온: 365 }, defaultStorage: '실온', aliases: ['미림', '청주', '요리술'] },
  { id: 'sesame', name: '깨', category: '양념/소스', unit: '작은술', shelf: { 실온: 180 }, defaultStorage: '실온', aliases: ['통깨', '참깨'] },
  { id: 'tomato_sauce', name: '토마토소스', category: '양념/소스', unit: 'ml', shelf: { 실온: 365, 냉장: 7 }, defaultStorage: '실온', aliases: ['파스타소스', '스파게티소스'] },
  { id: 'honey', name: '꿀', category: '양념/소스', unit: '큰술', shelf: { 실온: 1000 }, defaultStorage: '실온', aliases: ['올리고당', '물엿'] },
  { id: 'starch', name: '전분', category: '양념/소스', unit: '큰술', shelf: { 실온: 365 }, defaultStorage: '실온', aliases: ['감자전분', '옥수수전분'] },
  { id: 'stock', name: '다시마', category: '기타', unit: 'g', shelf: { 실온: 365 }, defaultStorage: '실온', aliases: ['다시다', '코인육수', '멸치다시마'] },
]

const byId = new Map(INGREDIENTS.map((i) => [i.id, i]))
export const ingredientById = (id: string) => byId.get(id)

export const normalizeName = (s: string) => s.replace(/\s+/g, '').toLowerCase()

const nameIndex = new Map<string, string>()
for (const ing of INGREDIENTS) {
  nameIndex.set(normalizeName(ing.name), ing.id)
  for (const a of ing.aliases ?? []) nameIndex.set(normalizeName(a), ing.id)
}

/** 사용자가 입력한 이름 → 카탈로그 id (정확 일치 → 포함 일치 순) */
export function resolveIngredientId(name: string): string | undefined {
  const n = normalizeName(name)
  if (!n) return undefined
  const exact = nameIndex.get(n)
  if (exact) return exact
  // 긴 키부터 포함 일치 (예: "국산 삼겹살 500g" → 삼겹살)
  const keys = [...nameIndex.keys()].sort((a, b) => b.length - a.length)
  for (const k of keys) if (k.length >= 2 && n.includes(k)) return nameIndex.get(k)
  return undefined
}

export function searchIngredients(q: string, limit = 8): Ingredient[] {
  const n = normalizeName(q)
  if (!n) return []
  const score = (ing: Ingredient) => {
    const names = [ing.name, ...(ing.aliases ?? [])].map(normalizeName)
    if (names.some((x) => x === n)) return 3
    if (names.some((x) => x.startsWith(n))) return 2
    if (names.some((x) => x.includes(n))) return 1
    return 0
  }
  return INGREDIENTS.map((i) => [i, score(i)] as const)
    .filter(([, s]) => s > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([i]) => i)
}
