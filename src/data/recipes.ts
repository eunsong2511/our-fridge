export interface RecipeIngredient {
  id: string        // ingredients.ts 의 id
  amount: number    // 1인분 기준
  unit: string
  optional?: boolean
}

export interface Recipe {
  id: string
  name: string
  desc: string
  minutes: number
  difficulty: '쉬움' | '보통' | '어려움'
  tags: string[]
  ingredients: RecipeIngredient[]   // 주재료 (매칭 점수에 반영)
  seasonings: RecipeIngredient[]    // 양념 (상비 가정, 점수 미반영)
  steps: string[]
}

const I = (id: string, amount: number, unit: string, optional = false): RecipeIngredient => ({ id, amount, unit, optional })

export const RECIPES: Recipe[] = [
  {
    id: 'kimchi_jjigae', name: '김치찌개', desc: '돼지고기와 신김치로 끓이는 기본 찌개', minutes: 30, difficulty: '쉬움', tags: ['국/찌개', '한식', '밥반찬'],
    ingredients: [I('kimchi', 150, 'g'), I('pork', 80, 'g'), I('tofu', 0.25, '모'), I('onion', 0.25, '개'), I('green_onion', 0.3, '대')],
    seasonings: [I('gochugaru', 0.5, '큰술'), I('garlic', 1, '쪽'), I('soy_sauce', 0.5, '큰술'), I('sugar', 0.25, '큰술'), I('cooking_oil', 0.5, '큰술')],
    steps: ['냄비에 식용유를 두르고 돼지고기를 중불에서 겉면이 익을 때까지 볶습니다.', '김치를 넣고 3분 정도 함께 볶아 김치 숨을 죽입니다.', '물(1인분당 300ml)과 고춧가루, 다진 마늘, 설탕을 넣고 15분간 끓입니다.', '두부와 양파를 넣고 5분 더 끓인 뒤 간장으로 간을 맞춥니다.', '대파를 넣고 1분 뒤 불을 끕니다.'],
  },
  {
    id: 'doenjang_jjigae', name: '된장찌개', desc: '애호박·두부·감자로 끓이는 구수한 찌개', minutes: 25, difficulty: '쉬움', tags: ['국/찌개', '한식', '밥반찬'],
    ingredients: [I('tofu', 0.25, '모'), I('zucchini', 0.25, '개'), I('potato', 0.5, '개'), I('onion', 0.25, '개'), I('green_onion', 0.3, '대'), I('mushroom', 30, 'g', true), I('chili', 0.5, '개', true)],
    seasonings: [I('doenjang', 1, '큰술'), I('garlic', 1, '쪽'), I('gochugaru', 0.3, '큰술'), I('dried_anchovy', 5, 'g', true)],
    steps: ['물(1인분당 300ml)에 멸치를 넣고 10분 끓여 육수를 냅니다. (없으면 생수로 진행)', '멸치를 건지고 된장을 풀어 넣습니다.', '감자, 양파를 넣고 5분 끓입니다.', '애호박, 버섯, 두부, 다진 마늘, 고춧가루를 넣고 5분 더 끓입니다.', '대파와 고추를 넣고 1분 뒤 마무리합니다.'],
  },
  {
    id: 'soondubu', name: '순두부찌개', desc: '얼큰한 국물의 순두부찌개', minutes: 20, difficulty: '보통', tags: ['국/찌개', '한식'],
    ingredients: [I('tofu', 0.5, '모'), I('egg', 1, '개'), I('pork', 50, 'g', true), I('onion', 0.25, '개'), I('green_onion', 0.3, '대'), I('kimchi', 50, 'g', true)],
    seasonings: [I('gochugaru', 1, '큰술'), I('garlic', 1, '쪽'), I('soy_sauce', 0.5, '큰술'), I('cooking_oil', 1, '큰술'), I('sesame_oil', 0.3, '큰술')],
    steps: ['냄비에 식용유, 고춧가루, 다진 마늘을 넣고 약불에서 30초 볶아 고추기름을 냅니다.', '돼지고기와 양파, 김치를 넣고 2분 볶습니다.', '물(1인분당 250ml)을 붓고 끓어오르면 순두부를 큼직하게 떠 넣습니다.', '간장으로 간을 하고 5분 끓입니다.', '달걀을 깨 넣고 대파를 올린 뒤 참기름을 둘러 마무리합니다.'],
  },
  {
    id: 'miyeok_guk', name: '미역국', desc: '소고기를 넣어 끓인 부드러운 미역국', minutes: 30, difficulty: '쉬움', tags: ['국/찌개', '한식'],
    ingredients: [I('miyeok', 7, 'g'), I('beef', 50, 'g')],
    seasonings: [I('soy_sauce', 1, '큰술'), I('garlic', 1, '쪽'), I('sesame_oil', 0.5, '큰술'), I('salt', 0.3, '작은술')],
    steps: ['건미역을 물에 10분 불린 뒤 물기를 짜고 먹기 좋게 자릅니다.', '냄비에 참기름을 두르고 소고기를 볶다가 미역을 넣고 2분 더 볶습니다.', '간장(국간장이 있으면 국간장)과 다진 마늘을 넣고 1분 볶습니다.', '물(1인분당 350ml)을 붓고 중불에서 20분 끓입니다.', '소금으로 간을 맞춥니다.'],
  },
  {
    id: 'egg_soup', name: '계란국', desc: '5분이면 끝나는 간단한 계란국', minutes: 10, difficulty: '쉬움', tags: ['국/찌개', '한식', '초간단'],
    ingredients: [I('egg', 1, '개'), I('green_onion', 0.3, '대'), I('onion', 0.2, '개', true)],
    seasonings: [I('soy_sauce', 0.5, '큰술'), I('salt', 0.3, '작은술'), I('garlic', 0.5, '쪽'), I('stock', 2, 'g', true)],
    steps: ['물(1인분당 300ml)에 다시마나 코인육수를 넣고 끓입니다.', '양파를 채 썰어 넣고 2분 끓입니다.', '달걀을 풀어 끓는 국물에 둘러가며 붓고 젓지 않고 10초 기다립니다.', '간장, 소금, 다진 마늘로 간을 하고 대파를 넣어 마무리합니다.'],
  },
  {
    id: 'kimchi_fried_rice', name: '김치볶음밥', desc: '남은 김치와 밥으로 만드는 국민 볶음밥', minutes: 15, difficulty: '쉬움', tags: ['밥', '한식', '초간단'],
    ingredients: [I('rice', 200, 'g'), I('kimchi', 100, 'g'), I('egg', 1, '개'), I('ham', 40, 'g', true), I('green_onion', 0.3, '대'), I('seaweed', 1, '장', true)],
    seasonings: [I('cooking_oil', 1, '큰술'), I('gochujang', 0.5, '큰술'), I('sesame_oil', 0.5, '큰술'), I('sugar', 0.3, '큰술'), I('sesame', 0.5, '작은술')],
    steps: ['김치와 햄을 잘게 썹니다.', '팬에 식용유를 두르고 대파를 볶아 파기름을 낸 뒤 햄과 김치를 3분 볶습니다.', '밥과 고추장, 설탕을 넣고 밥알이 풀어지도록 강불에서 볶습니다.', '참기름을 두르고 불을 끕니다.', '달걀 프라이를 올리고 김과 깨를 뿌립니다.'],
  },
  {
    id: 'egg_fried_rice', name: '계란볶음밥', desc: '재료가 없을 때 최고의 선택', minutes: 10, difficulty: '쉬움', tags: ['밥', '초간단'],
    ingredients: [I('rice', 200, 'g'), I('egg', 2, '개'), I('green_onion', 0.5, '대'), I('onion', 0.25, '개', true), I('carrot', 0.2, '개', true)],
    seasonings: [I('cooking_oil', 1.5, '큰술'), I('soy_sauce', 1, '큰술'), I('salt', 0.3, '작은술'), I('pepper', 0.2, '작은술'), I('sesame_oil', 0.5, '큰술')],
    steps: ['채소는 잘게 다집니다.', '팬에 식용유를 두르고 대파를 볶아 향을 냅니다.', '풀어놓은 달걀을 넣고 반쯤 익으면 밥을 넣고 강불에서 볶습니다.', '채소를 넣고 팬 가장자리에 간장을 둘러 눌려 향을 낸 뒤 섞습니다.', '소금, 후추로 간을 하고 참기름으로 마무리합니다.'],
  },
  {
    id: 'bibimbap', name: '비빔밥', desc: '남은 채소를 모두 넣는 비빔밥', minutes: 25, difficulty: '보통', tags: ['밥', '한식'],
    ingredients: [I('rice', 200, 'g'), I('egg', 1, '개'), I('spinach', 50, 'g', true), I('bean_sprout', 50, 'g', true), I('carrot', 0.25, '개', true), I('zucchini', 0.25, '개', true), I('mushroom', 30, 'g', true), I('beef', 50, 'g', true)],
    seasonings: [I('gochujang', 1, '큰술'), I('sesame_oil', 1, '큰술'), I('soy_sauce', 0.5, '큰술'), I('garlic', 1, '쪽'), I('sugar', 0.3, '큰술'), I('sesame', 0.5, '작은술'), I('cooking_oil', 1, '큰술')],
    steps: ['시금치와 콩나물은 각각 끓는 물에 1~2분 데쳐 소금, 참기름으로 무칩니다.', '당근, 애호박, 버섯은 채 썰어 각각 기름에 살짝 볶습니다.', '소고기는 간장, 설탕, 마늘로 밑간해 볶습니다.', '달걀 프라이를 반숙으로 부칩니다.', '밥 위에 재료를 둘러 담고 고추장과 참기름을 올려 비빕니다.'],
  },
  {
    id: 'curry', name: '카레라이스', desc: '감자·당근·양파가 들어간 기본 카레', minutes: 35, difficulty: '쉬움', tags: ['밥', '한그릇'],
    ingredients: [I('rice', 200, 'g'), I('curry_roux', 25, 'g'), I('potato', 0.5, '개'), I('carrot', 0.25, '개'), I('onion', 0.5, '개'), I('pork', 60, 'g', true)],
    seasonings: [I('cooking_oil', 1, '큰술')],
    steps: ['감자, 당근, 양파, 고기를 한입 크기로 썹니다.', '냄비에 기름을 두르고 양파가 투명해질 때까지 볶은 뒤 고기를 넣고 겉면을 익힙니다.', '감자, 당근을 넣고 2분 볶다가 물(1인분당 250ml)을 붓고 15분 끓입니다.', '불을 끄고 카레가루를 풀어 넣은 뒤 다시 약불에서 5분 저으며 끓입니다.', '밥 위에 끼얹어 냅니다.'],
  },
  {
    id: 'omurice', name: '오므라이스', desc: '케첩 볶음밥을 달걀로 감싼 오므라이스', minutes: 20, difficulty: '보통', tags: ['밥', '한그릇'],
    ingredients: [I('rice', 200, 'g'), I('egg', 2, '개'), I('onion', 0.25, '개'), I('ham', 40, 'g', true), I('carrot', 0.2, '개', true)],
    seasonings: [I('ketchup', 2, '큰술'), I('cooking_oil', 1.5, '큰술'), I('salt', 0.3, '작은술'), I('pepper', 0.2, '작은술'), I('butter', 5, 'g', true)],
    steps: ['양파, 햄, 당근을 잘게 다집니다.', '팬에 기름을 두르고 재료를 볶다가 밥과 케첩을 넣고 볶아 케첩밥을 만듭니다.', '다른 팬에 버터(또는 기름)를 두르고 소금 약간 넣어 푼 달걀을 부어 약불에서 반숙으로 익힙니다.', '달걀 위에 케첩밥을 올리고 감싸 접시에 뒤집어 담습니다.', '케첩을 뿌려 완성합니다.'],
  },
  {
    id: 'tuna_mayo_rice', name: '참치마요덮밥', desc: '참치캔 하나로 끝내는 덮밥', minutes: 10, difficulty: '쉬움', tags: ['밥', '초간단', '한그릇'],
    ingredients: [I('rice', 200, 'g'), I('tuna_can', 1, '캔'), I('egg', 1, '개', true), I('onion', 0.25, '개', true), I('seaweed', 1, '장', true)],
    seasonings: [I('mayo', 1.5, '큰술'), I('soy_sauce', 0.5, '큰술'), I('sugar', 0.3, '큰술'), I('sesame', 0.5, '작은술')],
    steps: ['참치는 기름을 빼고 마요네즈와 섞습니다.', '양파는 잘게 다져 찬물에 5분 담갔다가 물기를 뺍니다.', '간장과 설탕을 섞어 소스를 만듭니다.', '밥 위에 양파, 참치마요, 스크램블 에그를 올립니다.', '소스를 두르고 김과 깨를 뿌립니다.'],
  },
  {
    id: 'bulgogi', name: '소불고기', desc: '달콤짭조름한 소고기 불고기', minutes: 30, difficulty: '보통', tags: ['메인', '한식', '밥반찬'],
    ingredients: [I('beef', 150, 'g'), I('onion', 0.5, '개'), I('green_onion', 0.5, '대'), I('mushroom', 30, 'g', true), I('carrot', 0.2, '개', true)],
    seasonings: [I('soy_sauce', 2, '큰술'), I('sugar', 1, '큰술'), I('garlic', 2, '쪽'), I('sesame_oil', 1, '큰술'), I('pepper', 0.2, '작은술'), I('mirin', 1, '큰술', true), I('sesame', 0.5, '작은술')],
    steps: ['간장, 설탕, 다진 마늘, 참기름, 후추, 맛술을 섞어 양념장을 만듭니다. (배나 양파를 갈아 넣으면 더 부드러움)', '소고기에 양념장을 넣고 20분 이상 재웁니다.', '양파, 대파, 버섯, 당근을 썰어 둡니다.', '달군 팬에 고기와 채소를 넣고 중강불에서 국물이 자작해질 때까지 볶습니다.', '깨를 뿌려 완성합니다.'],
  },
  {
    id: 'jeyuk', name: '제육볶음', desc: '매콤한 고추장 양념의 돼지고기볶음', minutes: 30, difficulty: '보통', tags: ['메인', '한식', '밥반찬'],
    ingredients: [I('pork', 150, 'g'), I('onion', 0.5, '개'), I('green_onion', 0.5, '대'), I('cabbage', 0.1, '개', true), I('chili', 0.5, '개', true)],
    seasonings: [I('gochujang', 1, '큰술'), I('gochugaru', 1, '큰술'), I('soy_sauce', 1, '큰술'), I('sugar', 0.7, '큰술'), I('garlic', 2, '쪽'), I('ginger', 3, 'g', true), I('mirin', 1, '큰술', true), I('sesame_oil', 0.5, '큰술'), I('cooking_oil', 1, '큰술')],
    steps: ['고추장, 고춧가루, 간장, 설탕, 다진 마늘, 생강, 맛술을 섞어 양념장을 만듭니다.', '돼지고기에 양념장을 버무려 15분 재웁니다.', '팬에 기름을 두르고 고기를 중강불에서 5분 볶습니다.', '양파, 양배추, 대파, 고추를 넣고 채소가 숨 죽을 때까지 볶습니다.', '참기름을 둘러 마무리합니다.'],
  },
  {
    id: 'dakgalbi', name: '닭갈비', desc: '양배추·고구마와 볶는 매콤 닭갈비', minutes: 35, difficulty: '보통', tags: ['메인', '한식'],
    ingredients: [I('chicken', 150, 'g'), I('cabbage', 0.15, '개'), I('sweet_potato', 0.5, '개'), I('onion', 0.25, '개'), I('green_onion', 0.5, '대'), I('rice_cake', 50, 'g', true), I('perilla', 3, '장', true)],
    seasonings: [I('gochujang', 1, '큰술'), I('gochugaru', 1, '큰술'), I('soy_sauce', 1, '큰술'), I('sugar', 0.7, '큰술'), I('garlic', 2, '쪽'), I('curry_roux', 3, 'g', true), I('cooking_oil', 1, '큰술')],
    steps: ['양념 재료를 모두 섞어 닭고기에 버무려 20분 재웁니다.', '채소와 고구마는 한입 크기로 썹니다.', '넓은 팬에 기름을 두르고 닭고기를 넣고 중불에서 5분 볶습니다.', '고구마, 양배추, 양파, 떡을 넣고 뚜껑을 덮어 중약불에서 10분 익힙니다.', '뚜껑을 열고 대파, 깻잎을 넣어 강불에서 2분 볶습니다.'],
  },
  {
    id: 'dakdoritang', name: '닭볶음탕', desc: '감자와 당근을 넣고 자작하게 조린 닭볶음탕', minutes: 45, difficulty: '보통', tags: ['메인', '한식'],
    ingredients: [I('chicken', 250, 'g'), I('potato', 1, '개'), I('carrot', 0.3, '개'), I('onion', 0.5, '개'), I('green_onion', 0.5, '대')],
    seasonings: [I('gochujang', 1, '큰술'), I('gochugaru', 1.5, '큰술'), I('soy_sauce', 2, '큰술'), I('sugar', 1, '큰술'), I('garlic', 2, '쪽'), I('mirin', 1, '큰술', true), I('pepper', 0.2, '작은술')],
    steps: ['닭은 끓는 물에 2분 데쳐 불순물을 제거합니다.', '양념 재료를 섞어 양념장을 만듭니다.', '냄비에 닭, 양념장, 물(1인분당 200ml)을 넣고 센 불에서 끓입니다.', '끓으면 감자, 당근, 양파를 넣고 중불에서 25분 조립니다.', '국물이 자작해지면 대파를 넣고 2분 더 끓입니다.'],
  },
  {
    id: 'tteokbokki', name: '떡볶이', desc: '분식집 스타일 국물 떡볶이', minutes: 20, difficulty: '쉬움', tags: ['분식', '간식'],
    ingredients: [I('rice_cake', 150, 'g'), I('fish_cake', 50, 'g'), I('green_onion', 0.5, '대'), I('egg', 1, '개', true), I('cabbage', 0.05, '개', true)],
    seasonings: [I('gochujang', 1, '큰술'), I('gochugaru', 0.5, '큰술'), I('sugar', 1, '큰술'), I('soy_sauce', 0.5, '큰술'), I('garlic', 1, '쪽'), I('stock', 2, 'g', true)],
    steps: ['떡은 찬물에 10분 담가 둡니다. 어묵은 한입 크기로 썹니다.', '냄비에 물(1인분당 250ml)과 다시마(또는 코인육수)를 넣고 끓입니다.', '고추장, 고춧가루, 설탕, 간장, 다진 마늘을 풀어 넣습니다.', '떡과 어묵, 양배추를 넣고 국물이 걸쭉해질 때까지 10분 끓입니다.', '대파와 삶은 달걀을 넣고 마무리합니다.'],
  },
  {
    id: 'japchae', name: '잡채', desc: '채소와 고기를 볶아 섞은 당면 잡채 (당면 없으면 소면 대체)', minutes: 40, difficulty: '어려움', tags: ['한식', '명절'],
    ingredients: [I('noodle', 80, 'g'), I('beef', 50, 'g', true), I('spinach', 50, 'g'), I('onion', 0.25, '개'), I('carrot', 0.25, '개'), I('mushroom', 30, 'g'), I('egg', 0.5, '개', true)],
    seasonings: [I('soy_sauce', 2, '큰술'), I('sugar', 1, '큰술'), I('sesame_oil', 1, '큰술'), I('garlic', 1, '쪽'), I('cooking_oil', 1, '큰술'), I('sesame', 0.5, '작은술')],
    steps: ['면은 포장 표기대로 삶아 찬물에 헹구고 간장 0.5큰술, 참기름 0.5큰술로 밑간합니다.', '시금치는 데쳐 소금, 참기름으로 무칩니다.', '양파, 당근, 버섯은 채 썰어 각각 기름에 소금 간하여 볶습니다.', '소고기는 간장, 설탕, 마늘로 밑간해 볶습니다.', '모든 재료를 볼에 담고 남은 간장, 설탕, 참기름을 넣어 버무린 뒤 지단과 깨를 올립니다.'],
  },
  {
    id: 'gyeran_mari', name: '계란말이', desc: '채소 넣은 두툼한 계란말이', minutes: 15, difficulty: '보통', tags: ['밥반찬', '한식', '달걀'],
    ingredients: [I('egg', 3, '개'), I('green_onion', 0.3, '대'), I('carrot', 0.1, '개', true), I('onion', 0.1, '개', true), I('cheese', 1, '장', true)],
    seasonings: [I('salt', 0.3, '작은술'), I('cooking_oil', 1, '큰술'), I('mirin', 0.5, '큰술', true)],
    steps: ['채소는 아주 잘게 다지고, 달걀은 소금, 맛술을 넣어 체에 한 번 거릅니다.', '달걀물에 채소를 섞습니다.', '약불로 달군 팬에 기름을 얇게 두르고 달걀물 1/3을 붓습니다.', '윗면이 80% 익으면 한쪽 끝부터 말고, 빈 자리에 남은 달걀물을 부어 반복합니다.', '불을 끄고 1분 두었다가 한 김 식힌 뒤 썹니다.'],
  },
  {
    id: 'gyeran_jjim', name: '계란찜', desc: '뚝배기 없이도 되는 폭신한 계란찜', minutes: 15, difficulty: '쉬움', tags: ['밥반찬', '한식', '달걀'],
    ingredients: [I('egg', 2, '개'), I('green_onion', 0.2, '대')],
    seasonings: [I('salt', 0.3, '작은술'), I('sesame_oil', 0.3, '큰술'), I('stock', 2, 'g', true)],
    steps: ['달걀을 풀고 같은 양의 물(또는 육수)을 섞어 소금 간을 합니다.', '내열 그릇에 붓고 랩을 씌워 구멍을 몇 개 냅니다.', '전자레인지 700W에서 2분 30초 돌리고, 저어준 뒤 1분 30초 더 돌립니다. (뚝배기는 약불 8분)', '송송 썬 대파와 참기름을 올립니다.'],
  },
  {
    id: 'tofu_jorim', name: '두부조림', desc: '간장 양념에 조린 밥도둑 두부조림', minutes: 20, difficulty: '쉬움', tags: ['밥반찬', '한식'],
    ingredients: [I('tofu', 0.5, '모'), I('green_onion', 0.3, '대'), I('onion', 0.2, '개', true)],
    seasonings: [I('soy_sauce', 1.5, '큰술'), I('gochugaru', 0.5, '큰술'), I('sugar', 0.5, '큰술'), I('garlic', 1, '쪽'), I('sesame_oil', 0.5, '큰술'), I('cooking_oil', 1, '큰술'), I('sesame', 0.5, '작은술')],
    steps: ['두부는 1.5cm 두께로 썰어 키친타월로 물기를 뺍니다.', '팬에 기름을 두르고 두부를 양면 노릇하게 굽습니다.', '간장, 고춧가루, 설탕, 다진 마늘, 물 3큰술을 섞어 양념장을 만듭니다.', '구운 두부 위에 양념장을 끼얹고 양파, 대파를 올려 약불에서 5분 조립니다.', '참기름과 깨를 뿌립니다.'],
  },
  {
    id: 'kimchi_jeon', name: '김치전', desc: '비 오는 날 생각나는 바삭한 김치전', minutes: 20, difficulty: '쉬움', tags: ['전/부침', '한식', '간식'],
    ingredients: [I('kimchi', 100, 'g'), I('flour', 70, 'g'), I('onion', 0.2, '개', true), I('green_onion', 0.3, '대', true)],
    seasonings: [I('cooking_oil', 3, '큰술'), I('gochugaru', 0.3, '큰술', true), I('sugar', 0.3, '큰술')],
    steps: ['김치는 잘게 썰고 김치 국물 2큰술을 따로 둡니다.', '밀가루(부침가루)에 물 80ml, 김치 국물, 설탕을 넣고 되직하게 반죽합니다.', '김치, 양파, 대파를 섞습니다.', '팬에 기름을 넉넉히 두르고 반죽을 얇게 펴 중불에서 앞뒤 3분씩 바삭하게 굽습니다.'],
  },
  {
    id: 'pajeon', name: '파전', desc: '대파와 해물을 넣은 파전', minutes: 20, difficulty: '쉬움', tags: ['전/부침', '한식'],
    ingredients: [I('green_onion', 2, '대'), I('flour', 70, 'g'), I('egg', 1, '개'), I('shrimp', 3, '마리', true), I('squid', 0.3, '마리', true)],
    seasonings: [I('cooking_oil', 3, '큰술'), I('salt', 0.2, '작은술')],
    steps: ['대파는 팬 길이에 맞춰 길게 썹니다.', '밀가루에 물 90ml, 소금을 넣어 반죽합니다.', '팬에 기름을 두르고 대파를 가지런히 깐 뒤 반죽을 끼얹고 해물을 올립니다.', '달걀을 풀어 위에 두르고 중불에서 앞뒤로 노릇하게 굽습니다.', '간장+식초 초간장에 찍어 먹습니다.'],
  },
  {
    id: 'hobak_jeon', name: '애호박전', desc: '달걀옷 입혀 부친 애호박전', minutes: 15, difficulty: '쉬움', tags: ['전/부침', '한식', '밥반찬'],
    ingredients: [I('zucchini', 0.5, '개'), I('egg', 1, '개'), I('flour', 20, 'g')],
    seasonings: [I('salt', 0.3, '작은술'), I('cooking_oil', 2, '큰술')],
    steps: ['애호박을 0.7cm 두께로 썰어 소금을 뿌려 5분 두고 물기를 닦습니다.', '밀가루를 얇게 묻히고 풀어둔 달걀물을 입힙니다.', '팬에 기름을 두르고 중약불에서 앞뒤 2분씩 노릇하게 부칩니다.'],
  },
  {
    id: 'spinach_namul', name: '시금치나물', desc: '데쳐서 무치는 기본 나물', minutes: 10, difficulty: '쉬움', tags: ['밥반찬', '한식', '나물'],
    ingredients: [I('spinach', 100, 'g'), I('green_onion', 0.2, '대', true)],
    seasonings: [I('soy_sauce', 0.5, '큰술'), I('garlic', 0.5, '쪽'), I('sesame_oil', 0.5, '큰술'), I('salt', 0.2, '작은술'), I('sesame', 0.5, '작은술')],
    steps: ['끓는 물에 소금을 넣고 시금치를 줄기부터 넣어 40초 데칩니다.', '찬물에 헹궈 물기를 꼭 짜고 먹기 좋게 자릅니다.', '간장, 다진 마늘, 참기름, 깨를 넣고 조물조물 무칩니다. 모자란 간은 소금으로 맞춥니다.'],
  },
  {
    id: 'kongnamul_muchim', name: '콩나물무침', desc: '아삭한 콩나물무침', minutes: 10, difficulty: '쉬움', tags: ['밥반찬', '한식', '나물'],
    ingredients: [I('bean_sprout', 100, 'g'), I('green_onion', 0.2, '대', true)],
    seasonings: [I('gochugaru', 0.5, '큰술'), I('garlic', 0.5, '쪽'), I('sesame_oil', 0.5, '큰술'), I('salt', 0.3, '작은술'), I('sesame', 0.5, '작은술')],
    steps: ['냄비에 콩나물과 물 1/2컵, 소금 약간을 넣고 뚜껑을 덮은 채 5분 삶습니다.', '찬물에 헹궈 물기를 뺍니다.', '고춧가루, 다진 마늘, 참기름, 소금, 깨, 대파를 넣어 무칩니다.'],
  },
  {
    id: 'oi_muchim', name: '오이무침', desc: '새콤달콤 매콤한 오이무침', minutes: 10, difficulty: '쉬움', tags: ['밥반찬', '한식', '초간단'],
    ingredients: [I('cucumber', 1, '개'), I('onion', 0.2, '개', true)],
    seasonings: [I('gochugaru', 1, '큰술'), I('vinegar', 1, '큰술'), I('sugar', 0.7, '큰술'), I('soy_sauce', 0.5, '큰술'), I('garlic', 0.5, '쪽'), I('sesame', 0.5, '작은술'), I('salt', 0.3, '작은술')],
    steps: ['오이를 반달 모양으로 썰어 소금에 10분 절인 뒤 물기를 짭니다.', '양파는 얇게 채 썹니다.', '고춧가루, 식초, 설탕, 간장, 다진 마늘을 섞어 양념을 만듭니다.', '오이, 양파에 양념을 넣고 버무린 뒤 깨를 뿌립니다.'],
  },
  {
    id: 'gamja_jorim', name: '감자조림', desc: '달콤짭조름한 간장 감자조림', minutes: 20, difficulty: '쉬움', tags: ['밥반찬', '한식'],
    ingredients: [I('potato', 1, '개'), I('onion', 0.2, '개', true), I('carrot', 0.1, '개', true)],
    seasonings: [I('soy_sauce', 1, '큰술'), I('sugar', 0.5, '큰술'), I('honey', 0.5, '큰술'), I('garlic', 0.5, '쪽'), I('cooking_oil', 1, '큰술'), I('sesame', 0.5, '작은술')],
    steps: ['감자는 깍둑썰기하여 찬물에 5분 담가 전분을 뺍니다.', '팬에 기름을 두르고 감자를 3분 볶습니다.', '물 1/2컵, 간장, 설탕, 다진 마늘을 넣고 뚜껑을 덮어 중불에서 10분 조립니다.', '국물이 거의 없어지면 꿀(올리고당)을 넣고 윤기 나게 볶은 뒤 깨를 뿌립니다.'],
  },
  {
    id: 'eomuk_bokkeum', name: '어묵볶음', desc: '도시락 단골 어묵볶음', minutes: 10, difficulty: '쉬움', tags: ['밥반찬', '한식', '초간단'],
    ingredients: [I('fish_cake', 80, 'g'), I('onion', 0.2, '개'), I('green_onion', 0.2, '대', true), I('chili', 0.3, '개', true)],
    seasonings: [I('soy_sauce', 1, '큰술'), I('sugar', 0.5, '큰술'), I('garlic', 0.5, '쪽'), I('cooking_oil', 1, '큰술'), I('honey', 0.5, '큰술'), I('sesame', 0.5, '작은술')],
    steps: ['어묵은 먹기 좋게 썰어 끓는 물에 살짝 데쳐 기름기를 뺍니다.', '팬에 기름을 두르고 양파, 다진 마늘을 볶습니다.', '어묵, 간장, 설탕, 물 2큰술을 넣고 2분 볶습니다.', '꿀(올리고당), 대파, 고추를 넣어 섞고 깨를 뿌립니다.'],
  },
  {
    id: 'ramen_upgrade', name: '계란파 라면', desc: '달걀과 대파, 김치를 더한 라면', minutes: 8, difficulty: '쉬움', tags: ['면', '초간단'],
    ingredients: [I('ramen', 1, '봉'), I('egg', 1, '개'), I('green_onion', 0.3, '대'), I('kimchi', 30, 'g', true), I('cheese', 1, '장', true)],
    seasonings: [],
    steps: ['물 550ml를 끓이고 스프와 대파 절반을 넣습니다.', '면을 넣고 2분 끓입니다.', '달걀을 깨 넣고 젓지 말고 1분 더 끓입니다.', '남은 대파, 김치, 치즈를 올립니다.'],
  },
  {
    id: 'kimchi_udon', name: '김치우동', desc: '김치 넣은 칼칼한 우동', minutes: 15, difficulty: '쉬움', tags: ['면', '초간단'],
    ingredients: [I('udon', 1, '개'), I('kimchi', 80, 'g'), I('egg', 1, '개', true), I('green_onion', 0.3, '대'), I('fish_cake', 30, 'g', true)],
    seasonings: [I('soy_sauce', 1, '큰술'), I('gochugaru', 0.5, '큰술'), I('garlic', 1, '쪽'), I('stock', 3, 'g', true), I('sesame_oil', 0.3, '큰술')],
    steps: ['냄비에 참기름을 두르고 김치를 2분 볶습니다.', '물(1인분당 400ml)과 다시마(코인육수), 간장, 고춧가루, 마늘을 넣고 끓입니다.', '우동면과 어묵을 넣고 3분 끓입니다.', '달걀을 깨 넣고 대파를 올려 1분 더 끓입니다.'],
  },
  {
    id: 'bibim_guksu', name: '비빔국수', desc: '새콤달콤 매콤한 여름 비빔국수', minutes: 15, difficulty: '쉬움', tags: ['면', '한식'],
    ingredients: [I('noodle', 100, 'g'), I('kimchi', 50, 'g'), I('cucumber', 0.3, '개', true), I('egg', 1, '개', true), I('seaweed', 1, '장', true)],
    seasonings: [I('gochujang', 1, '큰술'), I('gochugaru', 0.5, '큰술'), I('vinegar', 1, '큰술'), I('sugar', 1, '큰술'), I('soy_sauce', 0.5, '큰술'), I('sesame_oil', 1, '큰술'), I('garlic', 0.5, '쪽'), I('sesame', 0.5, '작은술')],
    steps: ['고추장, 고춧가루, 식초, 설탕, 간장, 참기름, 마늘을 섞어 양념장을 만듭니다.', '소면을 3분 삶아 찬물에 여러 번 비벼 헹구고 물기를 뺍니다.', '김치는 잘게 썰고 오이는 채 썰고 달걀은 삶아 둡니다.', '면에 양념장을 넣고 비빈 뒤 김치, 오이, 달걀, 김을 올리고 깨를 뿌립니다.'],
  },
  {
    id: 'janchi_guksu', name: '잔치국수', desc: '멸치육수에 말아 먹는 따뜻한 국수', minutes: 20, difficulty: '쉬움', tags: ['면', '한식'],
    ingredients: [I('noodle', 100, 'g'), I('dried_anchovy', 10, 'g'), I('egg', 1, '개', true), I('zucchini', 0.2, '개', true), I('green_onion', 0.3, '대'), I('kimchi', 30, 'g', true)],
    seasonings: [I('soy_sauce', 1, '큰술'), I('salt', 0.3, '작은술'), I('garlic', 0.5, '쪽'), I('stock', 3, 'g', true), I('sesame_oil', 0.3, '큰술')],
    steps: ['물(1인분당 450ml)에 멸치와 다시마를 넣고 10분 끓인 뒤 건져 냅니다.', '육수에 간장(국간장), 소금, 마늘로 간을 합니다.', '애호박은 채 썰어 볶고 달걀은 지단을 부쳐 채 썹니다.', '소면을 삶아 찬물에 헹구고 그릇에 담습니다.', '뜨거운 육수를 붓고 고명과 대파, 김치를 올립니다.'],
  },
  {
    id: 'tomato_pasta', name: '토마토 파스타', desc: '토마토소스 베이스의 기본 파스타', minutes: 20, difficulty: '쉬움', tags: ['면', '양식'],
    ingredients: [I('pasta', 100, 'g'), I('tomato_sauce', 150, 'ml'), I('onion', 0.25, '개'), I('bacon', 2, '장', true), I('mushroom', 30, 'g', true), I('cheese', 1, '장', true)],
    seasonings: [I('garlic', 2, '쪽'), I('cooking_oil', 1.5, '큰술'), I('salt', 0.5, '작은술'), I('pepper', 0.2, '작은술')],
    steps: ['끓는 물에 소금을 넣고 파스타면을 포장 표기 시간보다 1분 적게 삶습니다. 면수 1/2컵을 남깁니다.', '팬에 올리브오일을 두르고 편 마늘, 양파, 베이컨, 버섯을 볶습니다.', '토마토소스와 면수를 넣고 3분 끓입니다.', '면을 넣고 1분 버무린 뒤 소금, 후추로 간하고 치즈를 올립니다.'],
  },
  {
    id: 'cream_pasta', name: '크림 파스타', desc: '생크림과 우유로 만드는 부드러운 파스타', minutes: 20, difficulty: '보통', tags: ['면', '양식'],
    ingredients: [I('pasta', 100, 'g'), I('cream', 100, 'ml'), I('milk', 100, 'ml'), I('onion', 0.25, '개'), I('bacon', 2, '장', true), I('mushroom', 40, 'g', true), I('cheese', 1, '장')],
    seasonings: [I('garlic', 2, '쪽'), I('butter', 10, 'g'), I('salt', 0.5, '작은술'), I('pepper', 0.2, '작은술')],
    steps: ['파스타면을 소금물에 포장 표기보다 1분 적게 삶습니다.', '팬에 버터를 녹여 마늘, 양파, 베이컨, 버섯을 볶습니다.', '생크림과 우유를 넣고 약불에서 3분 졸입니다.', '면과 치즈를 넣고 소스가 면에 엉기도록 1~2분 저어줍니다.', '소금, 후추로 간을 맞춥니다.'],
  },
  {
    id: 'aglio_olio', name: '알리오 올리오', desc: '마늘과 올리브오일만으로 만드는 파스타', minutes: 15, difficulty: '쉬움', tags: ['면', '양식', '초간단'],
    ingredients: [I('pasta', 100, 'g'), I('garlic', 5, '쪽'), I('chili', 0.5, '개', true), I('bacon', 1, '장', true)],
    seasonings: [I('cooking_oil', 3, '큰술'), I('salt', 0.5, '작은술'), I('pepper', 0.2, '작은술')],
    steps: ['소금물에 파스타면을 포장 표기보다 1분 적게 삶고 면수 1/2컵을 남깁니다.', '팬에 올리브오일을 넉넉히 두르고 편 마늘을 약불에서 노릇하게 볶습니다.', '고추(페페론치노)와 베이컨을 넣고 30초 볶습니다.', '면과 면수를 넣고 센 불에서 기름과 면수가 섞여 뽀얗게 될 때까지 흔들며 볶습니다.', '소금, 후추로 간을 맞춥니다.'],
  },
  {
    id: 'french_toast', name: '프렌치토스트', desc: '우유 달걀물에 적셔 구운 식빵', minutes: 10, difficulty: '쉬움', tags: ['아침', '간식', '초간단'],
    ingredients: [I('bread', 2, '장'), I('egg', 1, '개'), I('milk', 50, 'ml')],
    seasonings: [I('butter', 10, 'g'), I('sugar', 0.5, '큰술'), I('honey', 1, '큰술', true)],
    steps: ['달걀, 우유, 설탕을 섞어 달걀물을 만듭니다.', '식빵을 달걀물에 앞뒤로 충분히 적십니다.', '팬에 버터를 녹이고 약불에서 앞뒤 2분씩 노릇하게 굽습니다.', '꿀이나 시럽을 뿌려 냅니다.'],
  },
  {
    id: 'egg_sandwich', name: '에그 샌드위치', desc: '으깬 달걀 마요 샌드위치', minutes: 15, difficulty: '쉬움', tags: ['아침', '간식'],
    ingredients: [I('bread', 2, '장'), I('egg', 2, '개'), I('onion', 0.1, '개', true), I('cucumber', 0.2, '개', true), I('lettuce', 10, 'g', true)],
    seasonings: [I('mayo', 1.5, '큰술'), I('salt', 0.2, '작은술'), I('pepper', 0.2, '작은술'), I('sugar', 0.2, '큰술')],
    steps: ['달걀을 12분 삶아 껍질을 까고 포크로 으깹니다.', '잘게 다진 양파, 오이와 마요네즈, 소금, 후추, 설탕을 섞습니다.', '식빵 사이에 상추와 달걀 샐러드를 넣고 반으로 자릅니다.'],
  },
  {
    id: 'quesadilla', name: '치즈 퀘사디아', desc: '또띠아에 치즈와 재료를 넣고 구운 간식', minutes: 10, difficulty: '쉬움', tags: ['간식', '양식', '초간단'],
    ingredients: [I('tortilla', 1, '장'), I('cheese', 2, '장'), I('ham', 30, 'g', true), I('onion', 0.1, '개', true), I('bell_pepper', 0.2, '개', true), I('kimchi', 30, 'g', true)],
    seasonings: [I('cooking_oil', 0.5, '큰술')],
    steps: ['햄, 양파, 파프리카(또는 김치)를 잘게 썰어 살짝 볶습니다.', '또띠아 절반에 치즈와 재료를 올리고 반으로 접습니다.', '기름을 얇게 두른 팬에서 중약불로 앞뒤 2분씩 치즈가 녹을 때까지 굽습니다.', '먹기 좋게 잘라 냅니다.'],
  },
  {
    id: 'mandu_guk', name: '만둣국', desc: '냉동만두로 끓이는 간단 만둣국', minutes: 15, difficulty: '쉬움', tags: ['국/찌개', '한식', '초간단'],
    ingredients: [I('dumpling', 6, '개'), I('egg', 1, '개'), I('green_onion', 0.3, '대'), I('rice_cake', 50, 'g', true), I('seaweed', 1, '장', true)],
    seasonings: [I('soy_sauce', 1, '큰술'), I('salt', 0.3, '작은술'), I('garlic', 1, '쪽'), I('stock', 3, 'g', true), I('pepper', 0.2, '작은술')],
    steps: ['물(1인분당 400ml)에 다시마(코인육수)를 넣고 끓입니다.', '간장(국간장), 마늘로 간을 하고 만두와 떡을 넣어 5분 끓입니다.', '달걀을 풀어 둘러 넣고 대파를 넣습니다.', '소금, 후추로 간을 맞추고 김가루를 올립니다.'],
  },
  {
    id: 'godeungeo_gui', name: '고등어구이', desc: '팬에 노릇하게 구운 고등어', minutes: 15, difficulty: '쉬움', tags: ['메인', '한식', '밥반찬'],
    ingredients: [I('mackerel', 0.5, '마리'), I('lemon', 0.2, '개', true)],
    seasonings: [I('salt', 0.3, '작은술'), I('cooking_oil', 1, '큰술'), I('flour', 10, 'g', true)],
    steps: ['고등어에 소금을 뿌려 10분 두고 물기를 닦습니다. (간고등어는 생략)', '밀가루를 얇게 묻히면 껍질이 덜 달라붙습니다.', '팬에 기름을 두르고 껍질 쪽부터 중불에서 4분, 뒤집어 3분 굽습니다.', '레몬을 곁들여 냅니다.'],
  },
  {
    id: 'shrimp_fried_rice', name: '새우볶음밥', desc: '탱글한 새우가 들어간 볶음밥', minutes: 15, difficulty: '쉬움', tags: ['밥', '한그릇'],
    ingredients: [I('rice', 200, 'g'), I('shrimp', 6, '마리'), I('egg', 1, '개'), I('green_onion', 0.5, '대'), I('onion', 0.2, '개', true), I('carrot', 0.1, '개', true)],
    seasonings: [I('cooking_oil', 1.5, '큰술'), I('oyster_sauce', 1, '큰술'), I('soy_sauce', 0.5, '큰술'), I('pepper', 0.2, '작은술'), I('garlic', 1, '쪽')],
    steps: ['새우는 해동해 물기를 닦고, 채소는 잘게 다집니다.', '팬에 기름을 두르고 대파, 마늘을 볶아 향을 낸 뒤 새우를 넣고 색이 변할 때까지 볶습니다.', '달걀을 넣고 스크램블한 뒤 밥과 채소를 넣고 강불에서 볶습니다.', '굴소스, 간장, 후추로 간을 합니다.'],
  },
  {
    id: 'baechu_jeon', name: '배추전', desc: '배춧잎 통째로 부치는 경상도식 배추전', minutes: 15, difficulty: '쉬움', tags: ['전/부침', '한식'],
    ingredients: [I('napa_cabbage', 0.1, '포기'), I('flour', 50, 'g')],
    seasonings: [I('cooking_oil', 2, '큰술'), I('salt', 0.2, '작은술')],
    steps: ['배춧잎은 두꺼운 줄기 부분을 칼등으로 두드려 납작하게 만듭니다.', '밀가루에 물 70ml, 소금을 넣어 묽게 반죽합니다.', '배춧잎에 반죽을 묻혀 기름 두른 팬에 중불로 앞뒤 2~3분씩 굽습니다.', '초간장에 찍어 먹습니다.'],
  },
  {
    id: 'potato_jeon', name: '감자전', desc: '갈아서 부치는 쫀득한 감자전', minutes: 20, difficulty: '보통', tags: ['전/부침', '간식'],
    ingredients: [I('potato', 1.5, '개'), I('onion', 0.1, '개', true), I('chili', 0.3, '개', true)],
    seasonings: [I('salt', 0.3, '작은술'), I('cooking_oil', 3, '큰술')],
    steps: ['감자를 강판이나 믹서에 갈아 체에 받쳐 물기를 짭니다. 받은 물은 5분 두어 가라앉은 전분만 남깁니다.', '간 감자, 전분, 다진 양파, 소금을 섞습니다.', '팬에 기름을 두르고 반죽을 얇게 펴 중불에서 앞뒤 4분씩 노릇하게 굽습니다.', '고추를 올려 장식합니다.'],
  },
  {
    id: 'chicken_stir_fry', name: '닭가슴살 야채볶음', desc: '굴소스로 볶는 담백한 닭가슴살 요리', minutes: 15, difficulty: '쉬움', tags: ['메인', '다이어트'],
    ingredients: [I('chicken', 120, 'g'), I('broccoli', 0.3, '개', true), I('bell_pepper', 0.5, '개', true), I('onion', 0.25, '개'), I('mushroom', 30, 'g', true)],
    seasonings: [I('oyster_sauce', 1, '큰술'), I('soy_sauce', 0.5, '큰술'), I('garlic', 1, '쪽'), I('cooking_oil', 1, '큰술'), I('pepper', 0.2, '작은술')],
    steps: ['닭가슴살은 한입 크기로 썰어 소금, 후추로 밑간합니다.', '팬에 기름을 두르고 마늘과 닭고기를 겉면이 익을 때까지 볶습니다.', '단단한 채소(브로콜리, 당근)부터 넣고 2분, 나머지 채소를 넣고 2분 볶습니다.', '굴소스와 간장을 넣고 1분 더 볶습니다.'],
  },
  {
    id: 'tomato_egg', name: '토마토 달걀볶음', desc: '중국식 토마토 달걀볶음', minutes: 10, difficulty: '쉬움', tags: ['밥반찬', '초간단', '달걀'],
    ingredients: [I('tomato', 1, '개'), I('egg', 2, '개'), I('green_onion', 0.3, '대')],
    seasonings: [I('cooking_oil', 1.5, '큰술'), I('salt', 0.3, '작은술'), I('sugar', 0.5, '큰술'), I('soy_sauce', 0.3, '큰술')],
    steps: ['토마토는 웨지 모양으로 썰고 달걀은 소금 약간 넣어 풉니다.', '팬에 기름을 두르고 달걀을 넣어 크게 스크램블한 뒤 덜어 둡니다.', '같은 팬에 토마토와 설탕을 넣고 즙이 나올 때까지 2분 볶습니다.', '달걀을 다시 넣고 간장을 둘러 섞은 뒤 대파를 넣고 마무리합니다.'],
  },
  {
    id: 'bacon_egg', name: '베이컨 에그 브런치', desc: '베이컨, 달걀, 토스트의 기본 브런치', minutes: 10, difficulty: '쉬움', tags: ['아침', '초간단'],
    ingredients: [I('bacon', 2, '장'), I('egg', 2, '개'), I('bread', 1, '장', true), I('tomato', 0.5, '개', true)],
    seasonings: [I('salt', 0.2, '작은술'), I('pepper', 0.2, '작은술'), I('butter', 5, 'g', true)],
    steps: ['팬에 베이컨을 중불에서 바삭하게 구워 덜어 둡니다.', '베이컨 기름에 달걀을 깨 넣고 반숙 프라이를 만듭니다.', '식빵은 토스터나 팬에 버터를 두르고 굽습니다.', '토마토를 곁들이고 소금, 후추를 뿌립니다.'],
  },
  {
    id: 'fruit_yogurt', name: '과일 요거트볼', desc: '남은 과일을 올린 요거트 한 그릇', minutes: 5, difficulty: '쉬움', tags: ['아침', '간식', '초간단'],
    ingredients: [I('yogurt', 1, '개'), I('banana', 0.5, '개', true), I('strawberry', 50, 'g', true), I('apple', 0.25, '개', true), I('grape', 30, 'g', true)],
    seasonings: [I('honey', 0.5, '큰술', true)],
    steps: ['과일을 한입 크기로 썹니다.', '그릇에 요거트를 담고 과일을 올립니다.', '꿀을 두르고 있으면 견과류나 그래놀라를 뿌립니다.'],
  },
]
