/**
 * sampleData.js
 * ──────────────────────────────────────────────────────────────────────
 * 로컬 샘플 데이터 — Supabase 없이도 서비스를 바로 실행할 수 있도록 제공
 * Supabase 연동 후에는 각 hook에서 DB를 바라보도록 교체하면 됩니다.
 * ──────────────────────────────────────────────────────────────────────
 */

// ===== 태그 데이터 =====
export const TAGS = [
  // 분위기 태그
  { id: 't1', slug: 'quiet',     name_ko: '조용한',    emoji: '🤫', type: 'mood' },
  { id: 't2', slug: 'emotional', name_ko: '감성적인',  emoji: '🌿', type: 'mood' },
  { id: 't3', slug: 'vintage',   name_ko: '빈티지한',  emoji: '🪴', type: 'mood' },
  { id: 't4', slug: 'modern',    name_ko: '모던한',    emoji: '🖤', type: 'mood' },
  { id: 't5', slug: 'bright',    name_ko: '밝고 화사한', emoji: '☀️', type: 'mood' },
  { id: 't6', slug: 'cozy',      name_ko: '아늑한',    emoji: '🕯️', type: 'mood' },
  { id: 't7', slug: 'instagram', name_ko: '인스타감성', emoji: '📸', type: 'mood' },
  { id: 't8', slug: 'nature',    name_ko: '자연친화적', emoji: '🌱', type: 'mood' },
  // 상황 태그
  { id: 't9',  slug: 'date',       name_ko: '데이트',   emoji: '💑', type: 'situation' },
  { id: 't10', slug: 'solo',       name_ko: '혼자서',   emoji: '🎧', type: 'situation' },
  { id: 't11', slug: 'work',       name_ko: '작업·공부', emoji: '💻', type: 'situation' },
  { id: 't12', slug: 'group',      name_ko: '친구 모임', emoji: '👯', type: 'situation' },
  { id: 't13', slug: 'first-date', name_ko: '소개팅',   emoji: '🌸', type: 'situation' },
  { id: 't14', slug: 'special',    name_ko: '기념일',   emoji: '🎂', type: 'situation' },
  // 기타 태그
  { id: 't15', slug: 'budget',   name_ko: '가성비',      emoji: '💸', type: 'other' },
  { id: 't16', slug: 'dessert',  name_ko: '디저트 맛집', emoji: '🍰', type: 'other' },
  { id: 't17', slug: 'latenight',name_ko: '늦게까지 운영', emoji: '🌙', type: 'other' },
]

// ===== 장소 데이터 (15개) =====
export const PLACES = [
  {
    id: 'p1',
    slug: 'cafe-bomnal',
    name: '카페 봄날',
    region: '연남동',
    category: 'cafe',
    one_liner: '골목 안 햇살 가득한 작은 온실 카페',
    atmosphere_desc:
      '연남동 골목 깊숙이 숨어있는 유리 온실 구조의 카페. 낮에는 햇빛이 쏟아지고, 저녁엔 따뜻한 조명이 감성적인 분위기를 만들어냅니다. 식물이 가득한 공간에서 마시는 라떼 한 잔이 하루를 특별하게 만들어줄 거예요.',
    recommended_situations: ['첫 만남이나 소개팅 전 잠깐 들르기 딱 좋아요.', '혼자 책 읽으러 오기에도 조용하고 좋아요.', '사진 찍기 좋아서 인스타용으로 완벽합니다.'],
    detailed_review:
      '연남동 카페 골목을 걷다 보면 눈에 띄는 유리 온실 구조물이 바로 봄날입니다. 입구부터 크고 작은 화분들이 반겨주고, 실내는 통유리로 둘러싸여 있어 마치 온실 속에 들어온 것 같은 느낌을 줍니다. 시그니처 메뉴인 얼그레이 라떼와 바스크 치즈케이크가 특히 인기 있으며, 주말에는 웨이팅이 생기니 평일 오전 방문을 추천합니다. 콘센트와 와이파이도 있어 노트북 작업도 가능하지만, 분위기를 즐기는 용도로 더 어울리는 곳입니다.',
    price_range: '₩₩',
    hours: '11:00 - 22:00',
    instagram_url: '',
    cover_image_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
    images: [
      { image_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80', alt_text: '봄날 카페 외관' },
      { image_url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80', alt_text: '카페 내부' },
      { image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80', alt_text: '라떼와 케이크' },
    ],
    tags: ['t2', 't7', 't9', 't13', 't16'],
    bookmark_count: 128,
    view_count: 2340,
  },
  {
    id: 'p2',
    slug: 'record-dabang',
    name: '레코드 다방',
    region: '홍대',
    category: 'cafe',
    one_liner: 'LP판과 커피향이 어우러지는 빈티지 공간',
    atmosphere_desc:
      '1970~80년대 한국 LP 컬렉션이 벽을 가득 채운 독립 카페. 아날로그 턴테이블에서 흘러나오는 재즈와 낡은 나무 테이블이 시간을 되돌리는 느낌을 줍니다. 인스타 감성보다는 진짜 아날로그를 좋아하는 분께 추천.',
    recommended_situations: ['데이트 2차로 조용히 대화하기 좋아요.', 'LP 음악 들으며 혼자 멍 때리기 완벽한 공간이에요.'],
    detailed_review:
      '홍대 골목에서도 숨어있는 이 카페는 단골들만 아는 아지트 같은 곳입니다. 메뉴판도 손글씨로 쓰여 있고, 사장님이 직접 LP를 틀어주십니다. 에스프레소와 아이리시 커피가 주력 메뉴이며, 간단한 음식은 없지만 커피 퀄리티가 높습니다. 늦은 밤까지 운영하기 때문에 2차로 오기에도 좋습니다.',
    price_range: '₩₩',
    hours: '13:00 - 01:00',
    cover_image_url: 'https://images.unsplash.com/photo-1507914372368-b2b085b925a1?w=800&q=80',
    images: [
      { image_url: 'https://images.unsplash.com/photo-1507914372368-b2b085b925a1?w=800&q=80', alt_text: '레코드 다방 내부' },
      { image_url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80', alt_text: 'LP와 커피' },
    ],
    tags: ['t3', 't2', 't6', 't9', 't10', 't17'],
    bookmark_count: 95,
    view_count: 1820,
  },
  {
    id: 'p3',
    slug: 'studycafe-zero',
    name: '스터디카페 제로',
    region: '신촌',
    category: 'cafe',
    one_liner: '24시 운영, 콘센트 100%, 조용한 집중 공간',
    atmosphere_desc:
      '노트북 작업자와 수험생을 위해 설계된 미니멀한 카페. 모든 좌석에 콘센트와 USB 포트가 설치되어 있으며, 음악 없이 조용하게 운영됩니다. 오픈형 좌석과 1인 칸막이 좌석 모두 있어 취향껏 선택 가능.',
    recommended_situations: ['과제 마감 전날 밤 믿고 오는 곳이에요.', '시험 기간 자리 걱정 없이 올 수 있어요.'],
    detailed_review:
      '신촌역 2번 출구 도보 3분 거리에 있는 이 카페는 대학생들 사이에서 과제 카페로 유명합니다. 아메리카노 2,500원으로 가격도 착하고, 리필 가능한 음료도 있습니다. 24시간 운영이라 새벽에도 이용 가능하며, 소음 수칙을 철저히 지켜주는 편이라 실제로 집중이 잘 됩니다.',
    price_range: '₩',
    hours: '24시간',
    cover_image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    images: [
      { image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', alt_text: '스터디카페 내부' },
      { image_url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80', alt_text: '1인석' },
    ],
    tags: ['t1', 't4', 't11', 't10', 't15', 't17'],
    bookmark_count: 203,
    view_count: 4560,
  },
  {
    id: 'p4',
    slug: 'cafe-forest',
    name: '숲 카페',
    region: '연희동',
    category: 'cafe',
    one_liner: '서울 안에 숨겨진 작은 숲, 통유리 테라스',
    atmosphere_desc:
      '연희동 주택가 안에 자리한 2층 카페로, 테라스에서 바라보는 초록빛 정원이 서울 도심에서 자연을 느끼게 해줍니다. 이끼와 원목 소재로 꾸며진 인테리어가 산림욕하는 기분을 냅니다.',
    recommended_situations: ['데이트 코스로 산책 후 들르기 좋아요.', '여유로운 주말 오후 브런치에 딱이에요.'],
    detailed_review:
      '연희동 카페 중에서도 손꼽히는 감성 명소입니다. 1층은 원목 인테리어의 따뜻한 공간, 2층 테라스는 정원이 내려다보이는 뷰가 일품입니다. 메뉴는 시즌마다 바뀌며, 과일 에이드와 스콘이 특히 맛있습니다. 주차 공간이 없으니 대중교통 이용을 권장합니다.',
    price_range: '₩₩',
    hours: '10:00 - 21:00',
    cover_image_url: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80',
    images: [
      { image_url: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80', alt_text: '숲 카페 테라스' },
      { image_url: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=800&q=80', alt_text: '카페 내부' },
    ],
    tags: ['t2', 't8', 't5', 't9', 't7'],
    bookmark_count: 176,
    view_count: 3200,
  },
  {
    id: 'p5',
    slug: 'izakaya-hyehwa',
    name: '혜화 이자카야',
    region: '혜화',
    category: 'restaurant',
    one_liner: '연극 보고 2차, 혜화 골목 아지트 이자카야',
    atmosphere_desc:
      '혜화 대학로 골목 안에 자리한 아담한 이자카야. 나무 카운터석과 낮은 조명이 아늑한 분위기를 자아내며, 혼자와도 어색하지 않은 구조가 인상적입니다. 사장님이 직접 선곡한 재즈가 공간을 채웁니다.',
    recommended_situations: ['연극·전시 관람 후 2차 코스로 딱이에요.', '친구와 조용히 이야기 나누기 좋아요.'],
    detailed_review:
      '혜화역에서 도보 5분, 대학로 소극장 밀집 지역 안에 있는 이 이자카야는 혜화 로컬들이 애정하는 숨은 맛집입니다. 오마카세식 안주 구성이 매일 달라지며, 하이볼과 사케 종류가 다양합니다. 예약 없이 가면 웨이팅이 있으니 전화 예약 추천.',
    price_range: '₩₩₩',
    hours: '18:00 - 01:00',
    cover_image_url: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80',
    images: [
      { image_url: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80', alt_text: '이자카야 내부' },
      { image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80', alt_text: '안주와 하이볼' },
    ],
    tags: ['t3', 't6', 't9', 't12', 't17'],
    bookmark_count: 87,
    view_count: 1650,
  },
  {
    id: 'p6',
    slug: 'seongsu-rooftop',
    name: '성수 루프탑 바',
    region: '성수',
    category: 'bar',
    one_liner: '성수 공장 건물 옥상, 서울 야경이 펼쳐지는 루프탑',
    atmosphere_desc:
      '성수동 공장 건물을 개조한 복합문화공간 옥상에 자리한 루프탑 바. 해 질 녘부터 자리가 꽉 차는 인기 명소로, 서울 스카이라인과 함께 마시는 칵테일 한 잔이 특별한 추억을 만들어줍니다.',
    recommended_situations: ['기념일이나 특별한 날 분위기 잡기 완벽해요.', '데이트 저녁 코스로 강력 추천이에요.'],
    detailed_review:
      '성수역 도보 10분 거리의 이 루프탑은 예약제로 운영됩니다. 시그니처 칵테일은 서울 스카이라인을 모티프로 만들었으며, 계절별 한정 메뉴도 있습니다. 날씨에 영향을 많이 받으므로 방문 전 날씨 확인 필수. 저녁 7시 이후 분위기가 가장 좋습니다.',
    price_range: '₩₩₩',
    hours: '17:00 - 24:00',
    cover_image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    images: [
      { image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80', alt_text: '루프탑 야경' },
      { image_url: 'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?w=800&q=80', alt_text: '칵테일' },
    ],
    tags: ['t4', 't7', 't9', 't14', 't13'],
    bookmark_count: 241,
    view_count: 5120,
  },
  {
    id: 'p7',
    slug: 'eulji-pojangmacha',
    name: '을지로 포장마차',
    region: '을지로',
    category: 'restaurant',
    one_liner: '을지로 골목, 레트로 감성의 야외 포장마차',
    atmosphere_desc:
      '오래된 인쇄소와 철물점이 공존하는 을지로 골목에 생겨난 힙한 포장마차 거리. 노란 전구 아래서 먹는 떡볶이와 맥주 한 잔이 서울의 밤을 더 특별하게 만들어줍니다.',
    recommended_situations: ['친구들과 왁자지껄하게 즐기기 좋아요.', '레트로 감성 사진 찍기 최고의 장소예요.'],
    detailed_review:
      '을지로 3가 역 근처 골목에 밤이 되면 하나둘 문을 여는 포장마차들이 모여 하나의 거리를 형성합니다. 각 포장마차마다 특색 있는 메뉴가 있으며, 평균 1만원대로 맥주와 안주를 즐길 수 있습니다. 주말 저녁에는 자리 구하기 어려울 수 있으니 일찍 도착하세요.',
    price_range: '₩',
    hours: '18:00 - 02:00',
    cover_image_url: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=800&q=80',
    images: [
      { image_url: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=800&q=80', alt_text: '을지로 포장마차 야경' },
    ],
    tags: ['t3', 't5', 't12', 't15', 't17'],
    bookmark_count: 118,
    view_count: 2890,
  },
  {
    id: 'p8',
    slug: 'mangwon-brunch',
    name: '망원 브런치 키친',
    region: '망원동',
    category: 'restaurant',
    one_liner: '한강뷰 테라스에서 즐기는 올데이 브런치',
    atmosphere_desc:
      '망원 한강공원 근처에 자리한 브런치 전문 레스토랑. 통유리로 된 테라스에서 한강뷰를 보며 식사할 수 있어 주말이면 늘 웨이팅이 있습니다. 밝고 화사한 인테리어가 기분을 환기시켜줍니다.',
    recommended_situations: ['한강 피크닉 전후로 들르기 좋아요.', '여자친구/남자친구에게 데이트 코스로 추천 최고!'],
    detailed_review:
      '망원역 1번 출구에서 도보 5분. 에그베네딕트와 아보카도 토스트가 시그니처 메뉴입니다. 브런치 메뉴는 오후 3시까지 주문 가능하며, 저녁에는 파스타와 리조또 메뉴로 바뀝니다. 웨이팅 앱으로 원격 줄서기가 가능합니다.',
    price_range: '₩₩',
    hours: '09:00 - 21:00',
    cover_image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    images: [
      { image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80', alt_text: '브런치 플레이팅' },
      { image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80', alt_text: '테라스 뷰' },
    ],
    tags: ['t5', 't7', 't9', 't12', 't16'],
    bookmark_count: 155,
    view_count: 3400,
  },
  {
    id: 'p9',
    slug: 'hoegi-dessert',
    name: '회기 디저트 라운지',
    region: '회기',
    category: 'dessert',
    one_liner: '경희대 앞 딸기 케이크 맛집, 사진 찍고 싶은 플레이팅',
    atmosphere_desc:
      '경희대학교 정문 앞 골목에 자리한 디저트 카페. 계절 과일을 활용한 케이크와 타르트가 예술 작품처럼 아름답습니다. 작고 아늑한 공간이지만 앉으면 시간 가는 줄 모르게 됩니다.',
    recommended_situations: ['소개팅 마지막 코스로 달콤한 디저트 타임 추천해요.', '친구 생일 케이크 사기에도 딱이에요.'],
    detailed_review:
      '주인이 파티시에 출신으로 매일 신선한 재료로 케이크를 만듭니다. 딸기 시즌(12~4월)에는 특히 딸기 쇼트케이크가 일품이며, 하루에 수량이 한정되어 있어 오후에 가면 품절되기도 합니다. 포장 구매도 가능하며 예쁜 박스에 담아줍니다.',
    price_range: '₩₩',
    hours: '12:00 - 21:00',
    cover_image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80',
    images: [
      { image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80', alt_text: '딸기 케이크' },
      { image_url: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80', alt_text: '디저트 플레이팅' },
    ],
    tags: ['t2', 't7', 't9', 't13', 't16'],
    bookmark_count: 190,
    view_count: 4100,
  },
  {
    id: 'p10',
    slug: 'sinchon-teahouse',
    name: '신촌 다방',
    region: '신촌',
    category: 'cafe',
    one_liner: '전통 다방 분위기의 힙한 티하우스',
    atmosphere_desc:
      '1980년대 한국 다방을 현대적으로 재해석한 공간. 체크 무늬 커버와 나무 의자, 레트로 타일이 향수를 자극합니다. 전통차와 식혜, 수정과 등 한국 음료가 주력 메뉴.',
    recommended_situations: ['외국인 친구 데려오면 진짜 좋아해요.', '독특한 분위기에서 공부하고 싶을 때 와요.'],
    detailed_review:
      '신촌 연대 앞 골목에 자리한 이 티하우스는 전통과 힙함이 공존하는 특별한 공간입니다. 쌍화차, 대추차, 오미자차 등 전통 음료가 3,000~5,000원 선으로 착합니다. 인절미 떡과 함께 주문하면 완벽한 조합입니다.',
    price_range: '₩',
    hours: '11:00 - 22:00',
    cover_image_url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=80',
    images: [
      { image_url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=80', alt_text: '다방 내부' },
      { image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80', alt_text: '전통차' },
    ],
    tags: ['t3', 't6', 't10', 't11', 't15'],
    bookmark_count: 73,
    view_count: 1540,
  },
  {
    id: 'p11',
    slug: 'itaewon-vegan',
    name: '이태원 비건 키친',
    region: '이태원',
    category: 'restaurant',
    one_liner: '채식인도, 비채식인도 만족하는 글로벌 비건 레스토랑',
    atmosphere_desc:
      '이태원의 다양한 문화가 녹아든 비건 레스토랑. 밝고 모던한 인테리어에 다국적 메뉴 구성이 흥미롭습니다. 영어·한국어 메뉴 모두 준비되어 있어 외국인 친구와 함께 오기 좋습니다.',
    recommended_situations: ['채식주의자 친구와 함께 오기 완벽해요.', '건강하게 먹고 싶은 날 최고의 선택이에요.'],
    detailed_review:
      '이태원역 4번 출구 도보 3분. 버섯 스테이크, 두부 타코, 아사이볼 등 다양한 비건 메뉴를 제공합니다. 맛이 풍부해서 채식주의자가 아니더라도 만족할 수 있습니다. 글루텐 프리 옵션도 있습니다.',
    price_range: '₩₩',
    hours: '11:30 - 21:30',
    cover_image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
    images: [
      { image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80', alt_text: '비건 요리' },
    ],
    tags: ['t4', 't5', 't12', 't10'],
    bookmark_count: 62,
    view_count: 1320,
  },
  {
    id: 'p12',
    slug: 'yeouido-picnic-cafe',
    name: '여의도 피크닉 카페',
    region: '여의도',
    category: 'cafe',
    one_liner: '한강 바로 옆, 피크닉 도시락을 파는 이색 카페',
    atmosphere_desc:
      '여의도 한강공원 입구에 자리한 특별한 카페로, 커피와 함께 피크닉 도시락 세트를 구성해서 한강에서 즐길 수 있습니다. 돗자리, 쿨러, 블루투스 스피커 대여도 가능합니다.',
    recommended_situations: ['봄·가을 한강 나들이 코스로 최고예요.', '가족, 연인, 친구 모두와 즐길 수 있는 장소예요.'],
    detailed_review:
      '여의도역 1번 출구에서 도보 7분. 피크닉 세트는 샌드위치, 과일, 음료로 구성되며 2인 세트 기준 25,000원입니다. 주말에는 피크닉 세트가 빠르게 소진되므로 오전 중에 방문하는 것을 추천합니다.',
    price_range: '₩₩',
    hours: '10:00 - 19:00',
    cover_image_url: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&q=80',
    images: [
      { image_url: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&q=80', alt_text: '한강 피크닉' },
    ],
    tags: ['t5', 't8', 't9', 't12', 't7'],
    bookmark_count: 134,
    view_count: 2760,
  },
  {
    id: 'p13',
    slug: 'gyeongbok-hanbok',
    name: '경복궁 한복 찻집',
    region: '경복궁',
    category: 'cafe',
    one_liner: '한복 입고 전통 찻집에서 즐기는 오후 한때',
    atmosphere_desc:
      '경복궁 앞 한옥 찻집에서 한복을 무료로 대여해 차 한 잔의 여유를 즐기는 특별한 경험. 고즈넉한 마당과 기와지붕 아래서 전통 음료를 마시면 시간이 멈추는 것 같습니다.',
    recommended_situations: ['외국인 친구나 지방에서 올라온 가족과 함께 오기 좋아요.', '특별한 날 한복 사진 찍기에 완벽해요.'],
    detailed_review:
      '경복궁역 3번 출구 도보 5분. 한복 대여는 무료이며 찻집 이용 시 자동으로 제공됩니다. 쌍화탕, 모과차, 식혜 등 전통 음료가 메인이며, 약과·다식 세트가 함께 제공됩니다. 인스타그램 포토 스팟으로 유명하여 주말에는 웨이팅이 있습니다.',
    price_range: '₩₩',
    hours: '10:00 - 18:00',
    cover_image_url: 'https://images.unsplash.com/photo-1548625149-720754d445bb?w=800&q=80',
    images: [
      { image_url: 'https://images.unsplash.com/photo-1548625149-720754d445bb?w=800&q=80', alt_text: '한옥 찻집' },
    ],
    tags: ['t3', 't2', 't7', 't9', 't13'],
    bookmark_count: 219,
    view_count: 4780,
  },
  {
    id: 'p14',
    slug: 'dongdaemun-24h-ramen',
    name: '동대문 24시 라멘집',
    region: '동대문',
    category: 'restaurant',
    one_liner: '새벽 4시도 열려있는 진한 돈코츠 라멘집',
    atmosphere_desc:
      '동대문 쇼핑 후 새벽에 출출할 때 찾는 24시간 운영 라멘집. 카운터석으로만 구성된 좁고 긴 공간이지만, 주방에서 바로 나오는 라멘의 온도가 제격입니다.',
    recommended_situations: ['쇼핑 후 늦은 밤 배고플 때 유일한 선택이에요.', '혼자서도 전혀 어색하지 않은 카운터석 구조예요.'],
    detailed_review:
      '동대문역사문화공원역 1번 출구 도보 1분. 돈코츠 라멘 한 가지 메뉴만 운영하며 가격은 9,000원입니다. 육수를 16시간 이상 끓여 진하고 깊은 맛이 납니다. 계란 추가, 차슈 추가로 취향껏 커스텀 가능.',
    price_range: '₩',
    hours: '24시간',
    cover_image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80',
    images: [
      { image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80', alt_text: '라멘' },
    ],
    tags: ['t1', 't10', 't15', 't17'],
    bookmark_count: 89,
    view_count: 2100,
  },
  {
    id: 'p15',
    slug: 'bukchon-art-cafe',
    name: '북촌 아트 카페',
    region: '북촌',
    category: 'cafe',
    one_liner: '한옥 갤러리 카페, 로컬 아티스트 작품 상설 전시',
    atmosphere_desc:
      '북촌 한옥마을 내에 자리한 갤러리 겸 카페로, 젊은 로컬 아티스트들의 작품이 상설 전시됩니다. 전통 한옥 구조를 살린 공간에 현대 미술이 어우러진 독특한 분위기.',
    recommended_situations: ['예술적 감성을 충전하고 싶은 날 최고예요.', '사진작가 친구와 함께 오면 즐거운 시간 보장이에요.'],
    detailed_review:
      '안국역 2번 출구 도보 10분, 북촌 8경 코스 중간에 위치합니다. 카페 내 작품은 구매도 가능하며, 매달 새로운 작가의 전시로 바뀝니다. 핸드드립 커피와 플레인 스콘이 시그니처 메뉴입니다.',
    price_range: '₩₩',
    hours: '10:00 - 19:00',
    cover_image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80',
    images: [
      { image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80', alt_text: '갤러리 카페' },
      { image_url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80', alt_text: '핸드드립 커피' },
    ],
    tags: ['t2', 't1', 't7', 't9', 't10'],
    bookmark_count: 143,
    view_count: 3050,
  },
]

// ===== 큐레이션 데이터 (4개) =====
export const CURATIONS = [
  {
    id: 'c1',
    slug: 'hoegi-date-course',
    title: '회기 데이트 코스',
    subtitle: '경희대 앞 골목, 둘이서 걷기 좋은 하루',
    description:
      '혜화에서 시작해 회기까지 이어지는 감성 데이트 코스입니다. 전시 구경 후 예쁜 카페에서 달콤한 디저트, 저녁은 분위기 있는 이자카야로 마무리하는 완벽한 동선을 소개합니다.',
    cover_image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80',
    display_order: 1,
    place_ids: ['p9', 'p5', 'p1'],
    place_notes: {
      p9: '오후 3시, 달콤한 디저트로 시작',
      p5: '저녁 6시, 이자카야에서 마무리',
      p1: '카페 봄날에서 오후 티타임',
    },
  },
  {
    id: 'c2',
    slug: 'assignment-cafes',
    title: '과제하기 좋은 카페 모음',
    subtitle: '마감 전날 밤, 믿을 수 있는 공간들',
    description:
      '와이파이, 콘센트, 조용한 분위기 3박자를 갖춘 카페만 엄선했습니다. 대학생이라면 한 번쯤 마감 전날 밤을 지새운 경험이 있을 텐데, 이 카페들이라면 집중력을 유지하며 과제를 끝낼 수 있습니다.',
    cover_image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
    display_order: 2,
    place_ids: ['p3', 'p10', 'p15'],
    place_notes: {
      p3: '24시간 운영, 새벽 마감에 최적',
      p10: '전통 분위기에서 집중력 UP',
      p15: '갤러리 분위기로 창의력 자극',
    },
  },
  {
    id: 'c3',
    slug: 'solo-food-tour',
    title: '혼자 먹기 좋은 맛집 순례',
    subtitle: '혼자여도 전혀 어색하지 않은 카운터석 맛집',
    description:
      '혼밥이 처음인 분들도 편하게 즐길 수 있도록 카운터석이 있거나, 1인 손님을 적극 환영하는 공간들만 모았습니다. 혼자이기 때문에 오히려 더 자유롭고 맛있는 경험을 할 수 있습니다.',
    cover_image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1200&q=80',
    display_order: 3,
    place_ids: ['p14', 'p2', 'p10'],
    place_notes: {
      p14: '24시간 혼밥의 성지',
      p2: 'LP 들으며 혼자만의 시간',
      p10: '전통 차 한 잔의 여유',
    },
  },
  {
    id: 'c4',
    slug: 'sinchon-night-walk',
    title: '신촌 밤 산책 코스',
    subtitle: '술 없이도 분위기 있는 야경 스팟들',
    description:
      '신촌을 단순한 술자리 장소로만 알고 있다면 다시 생각해보세요. 늦은 밤에도 즐길 수 있는 카페와 공간들을 모아 특별한 밤 산책 코스를 구성했습니다.',
    cover_image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&q=80',
    display_order: 4,
    place_ids: ['p10', 'p3', 'p2'],
    place_notes: {
      p10: '저녁 산책 시작은 신촌 다방에서',
      p3: '새벽까지 운영하는 믿음직한 카페',
      p2: '밤 10시 이후 LP 감성으로 마무리',
    },
  },
]

// ===== 헬퍼 함수 =====

// 태그 slug로 태그 객체 찾기
export function getTagBySlug(slug) {
  return TAGS.find(t => t.slug === slug)
}

// 장소에 연결된 태그 객체 배열 반환
export function getPlaceTags(place) {
  return place.tags.map(tagId => TAGS.find(t => t.id === tagId)).filter(Boolean)
}

// 태그 slug 기준으로 장소 필터링
export function filterPlacesByTags(places, tagSlugs) {
  if (!tagSlugs || tagSlugs.length === 0) return places
  return places.filter(place => {
    const placeTags = getPlaceTags(place)
    return tagSlugs.every(slug => placeTags.some(t => t.slug === slug))
  })
}

// 검색어 기준으로 장소 필터링
export function searchPlaces(places, query) {
  if (!query) return places
  const q = query.toLowerCase()
  return places.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.region.toLowerCase().includes(q) ||
    p.one_liner.toLowerCase().includes(q)
  )
}

// 큐레이션에 포함된 장소 객체 배열 반환
export function getCurationPlaces(curation) {
  return curation.place_ids.map(id => PLACES.find(p => p.id === id)).filter(Boolean)
}
