-- ============================================================
-- Vibe Seoul — Supabase 데이터베이스 스키마
-- ============================================================
-- 사용 방법:
--   Supabase 대시보드 > SQL Editor 에 이 파일 내용을 붙여넣고 실행
-- ============================================================

-- 확장 모듈
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. 장소 (places)
-- ============================================================
CREATE TABLE IF NOT EXISTS places (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name             TEXT NOT NULL,
  slug             TEXT UNIQUE NOT NULL,
  region           TEXT NOT NULL,
  category         TEXT CHECK (category IN ('cafe','restaurant','bar','dessert')),
  one_liner        TEXT,
  atmosphere_desc  TEXT,
  detailed_review  TEXT,
  price_range      TEXT CHECK (price_range IN ('₩','₩₩','₩₩₩')),
  hours            TEXT,
  instagram_url    TEXT,
  cover_image_url  TEXT,
  is_published     BOOLEAN NOT NULL DEFAULT TRUE,
  view_count       INTEGER NOT NULL DEFAULT 0,
  bookmark_count   INTEGER NOT NULL DEFAULT 0
);

-- ============================================================
-- 2. 장소 이미지 (place_images)
-- ============================================================
CREATE TABLE IF NOT EXISTS place_images (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id      UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  image_url     TEXT NOT NULL,
  display_order SMALLINT DEFAULT 0,
  alt_text      TEXT
);

-- ============================================================
-- 3. 태그 (tags)
-- ============================================================
CREATE TABLE IF NOT EXISTS tags (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,
  name_ko       TEXT NOT NULL,
  type          TEXT CHECK (type IN ('mood','situation','other')),
  emoji         TEXT,
  display_order SMALLINT DEFAULT 0
);

-- ============================================================
-- 4. 장소-태그 연결 (place_tags)
-- ============================================================
CREATE TABLE IF NOT EXISTS place_tags (
  place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  tag_id   UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (place_id, tag_id)
);

-- ============================================================
-- 5. 큐레이션 (curations)
-- ============================================================
CREATE TABLE IF NOT EXISTS curations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  slug            TEXT UNIQUE NOT NULL,
  title           TEXT NOT NULL,
  subtitle        TEXT,
  description     TEXT,
  cover_image_url TEXT,
  is_published    BOOLEAN NOT NULL DEFAULT TRUE,
  display_order   SMALLINT DEFAULT 0
);

-- ============================================================
-- 6. 큐레이션-장소 연결 (curation_places)
-- ============================================================
CREATE TABLE IF NOT EXISTS curation_places (
  curation_id   UUID NOT NULL REFERENCES curations(id) ON DELETE CASCADE,
  place_id      UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  display_order SMALLINT NOT NULL DEFAULT 0,
  note          TEXT,
  PRIMARY KEY (curation_id, place_id)
);

-- ============================================================
-- 7. 북마크 (bookmarks)
-- ============================================================
CREATE TABLE IF NOT EXISTS bookmarks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  place_id   UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  UNIQUE (user_id, place_id)
);

-- ============================================================
-- Row Level Security (RLS) 정책
-- ============================================================

-- places: 퍼블릭 읽기 허용 (is_published = true)
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published places"
  ON places FOR SELECT USING (is_published = true);

-- place_images: 퍼블릭 읽기
ALTER TABLE place_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read place_images"
  ON place_images FOR SELECT USING (true);

-- tags / place_tags / curations / curation_places: 퍼블릭 읽기
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read tags" ON tags FOR SELECT USING (true);

ALTER TABLE place_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read place_tags" ON place_tags FOR SELECT USING (true);

ALTER TABLE curations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published curations"
  ON curations FOR SELECT USING (is_published = true);

ALTER TABLE curation_places ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read curation_places"
  ON curation_places FOR SELECT USING (true);

-- bookmarks: 본인 데이터만 읽기/쓰기/삭제
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own bookmarks"
  ON bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own bookmarks"
  ON bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own bookmarks"
  ON bookmarks FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- 조회수 증가 함수 (클라이언트에서 UPDATE 권한 없이 호출 가능)
-- ============================================================
CREATE OR REPLACE FUNCTION increment_view_count(place_id UUID)
RETURNS VOID LANGUAGE SQL SECURITY DEFINER AS $$
  UPDATE places SET view_count = view_count + 1 WHERE id = place_id;
$$;

-- ============================================================
-- 북마크 수 자동 동기화 트리거
-- ============================================================
CREATE OR REPLACE FUNCTION sync_bookmark_count()
RETURNS TRIGGER LANGUAGE PLPGSQL AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE places SET bookmark_count = bookmark_count + 1 WHERE id = NEW.place_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE places SET bookmark_count = GREATEST(bookmark_count - 1, 0) WHERE id = OLD.place_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER bookmarks_count_trigger
AFTER INSERT OR DELETE ON bookmarks
FOR EACH ROW EXECUTE FUNCTION sync_bookmark_count();

-- ============================================================
-- 인덱스 (성능 최적화)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_places_slug ON places(slug);
CREATE INDEX IF NOT EXISTS idx_places_region ON places(region);
CREATE INDEX IF NOT EXISTS idx_places_bookmark_count ON places(bookmark_count DESC);
CREATE INDEX IF NOT EXISTS idx_place_images_place_id ON place_images(place_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_place_id ON bookmarks(place_id);
CREATE INDEX IF NOT EXISTS idx_curations_slug ON curations(slug);

-- ============================================================
-- [추가] 장소 관리 기능 확장
-- 이 섹션은 기본 스키마 실행 후 추가로 실행하세요.
-- ============================================================

-- [A] 누락 컬럼 추가
ALTER TABLE places
  ADD COLUMN IF NOT EXISTS recommended_situations TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS source                 TEXT    NOT NULL DEFAULT 'custom';

-- [B] category constraint에 'spot' 추가 (기존: cafe/restaurant/bar/dessert)
ALTER TABLE places DROP CONSTRAINT IF EXISTS places_category_check;
ALTER TABLE places ADD CONSTRAINT places_category_check
  CHECK (category IN ('cafe','restaurant','bar','dessert','spot'));

-- [C] RLS 쓰기 정책 — places
CREATE POLICY IF NOT EXISTS "Anyone can insert places"
  ON places FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Anyone can update custom places"
  ON places FOR UPDATE USING (source = 'custom');
CREATE POLICY IF NOT EXISTS "Anyone can delete custom places"
  ON places FOR DELETE USING (source = 'custom');
  -- ※ source='default' 기본 장소는 RLS로 삭제/수정 불가

-- [C] RLS 쓰기 정책 — place_tags
CREATE POLICY IF NOT EXISTS "Anyone can insert place_tags"
  ON place_tags FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Anyone can delete place_tags"
  ON place_tags FOR DELETE USING (true);

-- [C] RLS 쓰기 정책 — place_images
CREATE POLICY IF NOT EXISTS "Anyone can insert place_images"
  ON place_images FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Anyone can delete place_images"
  ON place_images FOR DELETE USING (true);

-- ============================================================
-- [D] Seed: 17개 태그
-- ============================================================
INSERT INTO tags (slug, name_ko, emoji, type, display_order) VALUES
  ('quiet',      '조용한',        '🤫', 'mood',      1),
  ('emotional',  '감성적인',      '🌿', 'mood',      2),
  ('vintage',    '빈티지한',      '🪴', 'mood',      3),
  ('modern',     '모던한',        '🖤', 'mood',      4),
  ('bright',     '밝고 화사한',   '☀️',  'mood',      5),
  ('cozy',       '아늑한',        '🕯️',  'mood',      6),
  ('instagram',  '인스타감성',    '📸', 'mood',      7),
  ('nature',     '자연친화적',    '🌱', 'mood',      8),
  ('date',       '데이트',        '💑', 'situation', 1),
  ('solo',       '혼자서',        '🎧', 'situation', 2),
  ('work',       '작업·공부',     '💻', 'situation', 3),
  ('group',      '친구 모임',     '👯', 'situation', 4),
  ('first-date', '소개팅',        '🌸', 'situation', 5),
  ('special',    '기념일',        '🎂', 'situation', 6),
  ('budget',     '가성비',        '💸', 'other',     1),
  ('dessert',    '디저트 맛집',   '🍰', 'other',     2),
  ('latenight',  '늦게까지 운영', '🌙', 'other',     3)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- [E] Seed: 15개 기본 장소 (source = 'default')
-- ============================================================
DO $$
DECLARE p UUID;
BEGIN

-- p1: 카페 봄날
INSERT INTO places (slug,name,region,category,one_liner,atmosphere_desc,recommended_situations,detailed_review,price_range,hours,cover_image_url,is_published,source,bookmark_count,view_count)
VALUES ('cafe-bomnal','카페 봄날','연남동','cafe','골목 안 햇살 가득한 작은 온실 카페',
'연남동 골목 깊숙이 숨어있는 유리 온실 구조의 카페. 낮에는 햇빛이 쏟아지고, 저녁엔 따뜻한 조명이 감성적인 분위기를 만들어냅니다. 식물이 가득한 공간에서 마시는 라떼 한 잔이 하루를 특별하게 만들어줄 거예요.',
ARRAY['첫 만남이나 소개팅 전 잠깐 들르기 딱 좋아요.','혼자 책 읽으러 오기에도 조용하고 좋아요.','사진 찍기 좋아서 인스타용으로 완벽합니다.'],
'연남동 카페 골목을 걷다 보면 눈에 띄는 유리 온실 구조물이 바로 봄날입니다. 입구부터 크고 작은 화분들이 반겨주고, 실내는 통유리로 둘러싸여 있어 마치 온실 속에 들어온 것 같은 느낌을 줍니다. 시그니처 메뉴인 얼그레이 라떼와 바스크 치즈케이크가 특히 인기 있으며, 주말에는 웨이팅이 생기니 평일 오전 방문을 추천합니다.',
'₩₩','11:00 - 22:00','https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',true,'default',128,2340)
ON CONFLICT (slug) DO NOTHING RETURNING id INTO p;
IF p IS NOT NULL THEN
  INSERT INTO place_tags (place_id,tag_id) SELECT p,id FROM tags WHERE slug IN ('emotional','instagram','date','first-date','dessert');
  INSERT INTO place_images (place_id,image_url,alt_text,display_order) VALUES
    (p,'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80','봄날 카페 외관',0),
    (p,'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80','카페 내부',1),
    (p,'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80','라떼와 케이크',2);
END IF;

-- p2: 레코드 다방
INSERT INTO places (slug,name,region,category,one_liner,atmosphere_desc,recommended_situations,detailed_review,price_range,hours,cover_image_url,is_published,source,bookmark_count,view_count)
VALUES ('record-dabang','레코드 다방','홍대','cafe','LP판과 커피향이 어우러지는 빈티지 공간',
'1970~80년대 한국 LP 컬렉션이 벽을 가득 채운 독립 카페. 아날로그 턴테이블에서 흘러나오는 재즈와 낡은 나무 테이블이 시간을 되돌리는 느낌을 줍니다.',
ARRAY['데이트 2차로 조용히 대화하기 좋아요.','LP 음악 들으며 혼자 멍 때리기 완벽한 공간이에요.'],
'홍대 골목에서도 숨어있는 이 카페는 단골들만 아는 아지트 같은 곳입니다. 에스프레소와 아이리시 커피가 주력 메뉴이며, 늦은 밤까지 운영합니다.',
'₩₩','13:00 - 01:00','https://images.unsplash.com/photo-1507914372368-b2b085b925a1?w=800&q=80',true,'default',95,1820)
ON CONFLICT (slug) DO NOTHING RETURNING id INTO p;
IF p IS NOT NULL THEN
  INSERT INTO place_tags (place_id,tag_id) SELECT p,id FROM tags WHERE slug IN ('vintage','emotional','cozy','date','solo','latenight');
  INSERT INTO place_images (place_id,image_url,alt_text,display_order) VALUES
    (p,'https://images.unsplash.com/photo-1507914372368-b2b085b925a1?w=800&q=80','레코드 다방 내부',0),
    (p,'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80','LP와 커피',1);
END IF;

-- p3: 스터디카페 제로
INSERT INTO places (slug,name,region,category,one_liner,atmosphere_desc,recommended_situations,detailed_review,price_range,hours,cover_image_url,is_published,source,bookmark_count,view_count)
VALUES ('studycafe-zero','스터디카페 제로','신촌','cafe','24시 운영, 콘센트 100%, 조용한 집중 공간',
'노트북 작업자와 수험생을 위해 설계된 미니멀한 카페. 모든 좌석에 콘센트와 USB 포트가 설치되어 있으며, 음악 없이 조용하게 운영됩니다.',
ARRAY['과제 마감 전날 밤 믿고 오는 곳이에요.','시험 기간 자리 걱정 없이 올 수 있어요.'],
'신촌역 2번 출구 도보 3분 거리에 있는 이 카페는 대학생들 사이에서 과제 카페로 유명합니다. 아메리카노 2,500원으로 가격도 착합니다.',
'₩','24시간','https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',true,'default',203,4560)
ON CONFLICT (slug) DO NOTHING RETURNING id INTO p;
IF p IS NOT NULL THEN
  INSERT INTO place_tags (place_id,tag_id) SELECT p,id FROM tags WHERE slug IN ('quiet','modern','work','solo','budget','latenight');
  INSERT INTO place_images (place_id,image_url,alt_text,display_order) VALUES
    (p,'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80','스터디카페 내부',0),
    (p,'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80','1인석',1);
END IF;

-- p4: 숲 카페
INSERT INTO places (slug,name,region,category,one_liner,atmosphere_desc,recommended_situations,detailed_review,price_range,hours,cover_image_url,is_published,source,bookmark_count,view_count)
VALUES ('cafe-forest','숲 카페','연희동','cafe','서울 안에 숨겨진 작은 숲, 통유리 테라스',
'연희동 주택가 안에 자리한 2층 카페로, 테라스에서 바라보는 초록빛 정원이 서울 도심에서 자연을 느끼게 해줍니다.',
ARRAY['데이트 코스로 산책 후 들르기 좋아요.','여유로운 주말 오후 브런치에 딱이에요.'],
'연희동 카페 중에서도 손꼽히는 감성 명소입니다. 1층은 원목 인테리어의 따뜻한 공간, 2층 테라스는 정원이 내려다보이는 뷰가 일품입니다.',
'₩₩','10:00 - 21:00','https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80',true,'default',176,3200)
ON CONFLICT (slug) DO NOTHING RETURNING id INTO p;
IF p IS NOT NULL THEN
  INSERT INTO place_tags (place_id,tag_id) SELECT p,id FROM tags WHERE slug IN ('emotional','nature','bright','date','instagram');
  INSERT INTO place_images (place_id,image_url,alt_text,display_order) VALUES
    (p,'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80','숲 카페 테라스',0),
    (p,'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=800&q=80','카페 내부',1);
END IF;

-- p5: 혜화 이자카야
INSERT INTO places (slug,name,region,category,one_liner,atmosphere_desc,recommended_situations,detailed_review,price_range,hours,cover_image_url,is_published,source,bookmark_count,view_count)
VALUES ('izakaya-hyehwa','혜화 이자카야','혜화','restaurant','연극 보고 2차, 혜화 골목 아지트 이자카야',
'혜화 대학로 골목 안에 자리한 아담한 이자카야. 나무 카운터석과 낮은 조명이 아늑한 분위기를 자아내며, 사장님이 직접 선곡한 재즈가 공간을 채웁니다.',
ARRAY['연극·전시 관람 후 2차 코스로 딱이에요.','친구와 조용히 이야기 나누기 좋아요.'],
'혜화역에서 도보 5분, 대학로 소극장 밀집 지역 안에 있는 이 이자카야는 혜화 로컬들이 애정하는 숨은 맛집입니다. 예약 없이 가면 웨이팅이 있으니 전화 예약 추천.',
'₩₩₩','18:00 - 01:00','https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80',true,'default',87,1650)
ON CONFLICT (slug) DO NOTHING RETURNING id INTO p;
IF p IS NOT NULL THEN
  INSERT INTO place_tags (place_id,tag_id) SELECT p,id FROM tags WHERE slug IN ('vintage','cozy','date','group','latenight');
  INSERT INTO place_images (place_id,image_url,alt_text,display_order) VALUES
    (p,'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80','이자카야 내부',0),
    (p,'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80','안주와 하이볼',1);
END IF;

-- p6: 성수 루프탑 바
INSERT INTO places (slug,name,region,category,one_liner,atmosphere_desc,recommended_situations,detailed_review,price_range,hours,cover_image_url,is_published,source,bookmark_count,view_count)
VALUES ('seongsu-rooftop','성수 루프탑 바','성수','bar','성수 공장 건물 옥상, 서울 야경이 펼쳐지는 루프탑',
'성수동 공장 건물을 개조한 복합문화공간 옥상에 자리한 루프탑 바. 해 질 녘부터 자리가 꽉 차는 인기 명소로, 서울 스카이라인과 함께 마시는 칵테일 한 잔이 특별한 추억을 만들어줍니다.',
ARRAY['기념일이나 특별한 날 분위기 잡기 완벽해요.','데이트 저녁 코스로 강력 추천이에요.'],
'성수역 도보 10분 거리의 이 루프탑은 예약제로 운영됩니다. 시그니처 칵테일은 서울 스카이라인을 모티프로 만들었으며, 계절별 한정 메뉴도 있습니다.',
'₩₩₩','17:00 - 24:00','https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',true,'default',241,5120)
ON CONFLICT (slug) DO NOTHING RETURNING id INTO p;
IF p IS NOT NULL THEN
  INSERT INTO place_tags (place_id,tag_id) SELECT p,id FROM tags WHERE slug IN ('modern','instagram','date','special','first-date');
  INSERT INTO place_images (place_id,image_url,alt_text,display_order) VALUES
    (p,'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80','루프탑 야경',0),
    (p,'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?w=800&q=80','칵테일',1);
END IF;

-- p7: 을지로 포장마차
INSERT INTO places (slug,name,region,category,one_liner,atmosphere_desc,recommended_situations,detailed_review,price_range,hours,cover_image_url,is_published,source,bookmark_count,view_count)
VALUES ('eulji-pojangmacha','을지로 포장마차','을지로','restaurant','을지로 골목, 레트로 감성의 야외 포장마차',
'오래된 인쇄소와 철물점이 공존하는 을지로 골목에 생겨난 힙한 포장마차 거리. 노란 전구 아래서 먹는 떡볶이와 맥주 한 잔이 서울의 밤을 더 특별하게 만들어줍니다.',
ARRAY['친구들과 왁자지껄하게 즐기기 좋아요.','레트로 감성 사진 찍기 최고의 장소예요.'],
'을지로 3가 역 근처 골목에 밤이 되면 하나둘 문을 여는 포장마차들이 모여 하나의 거리를 형성합니다. 주말 저녁에는 자리 구하기 어려울 수 있으니 일찍 도착하세요.',
'₩','18:00 - 02:00','https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=800&q=80',true,'default',118,2890)
ON CONFLICT (slug) DO NOTHING RETURNING id INTO p;
IF p IS NOT NULL THEN
  INSERT INTO place_tags (place_id,tag_id) SELECT p,id FROM tags WHERE slug IN ('vintage','bright','group','budget','latenight');
  INSERT INTO place_images (place_id,image_url,alt_text,display_order) VALUES
    (p,'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=800&q=80','을지로 포장마차 야경',0);
END IF;

-- p8: 망원 브런치 키친
INSERT INTO places (slug,name,region,category,one_liner,atmosphere_desc,recommended_situations,detailed_review,price_range,hours,cover_image_url,is_published,source,bookmark_count,view_count)
VALUES ('mangwon-brunch','망원 브런치 키친','망원동','restaurant','한강뷰 테라스에서 즐기는 올데이 브런치',
'망원 한강공원 근처에 자리한 브런치 전문 레스토랑. 통유리로 된 테라스에서 한강뷰를 보며 식사할 수 있어 주말이면 늘 웨이팅이 있습니다.',
ARRAY['한강 피크닉 전후로 들르기 좋아요.','여자친구/남자친구에게 데이트 코스로 추천 최고!'],
'망원역 1번 출구에서 도보 5분. 에그베네딕트와 아보카도 토스트가 시그니처 메뉴입니다. 브런치 메뉴는 오후 3시까지 주문 가능합니다.',
'₩₩','09:00 - 21:00','https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',true,'default',155,3400)
ON CONFLICT (slug) DO NOTHING RETURNING id INTO p;
IF p IS NOT NULL THEN
  INSERT INTO place_tags (place_id,tag_id) SELECT p,id FROM tags WHERE slug IN ('bright','instagram','date','group','dessert');
  INSERT INTO place_images (place_id,image_url,alt_text,display_order) VALUES
    (p,'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80','브런치 플레이팅',0),
    (p,'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80','테라스 뷰',1);
END IF;

-- p9: 회기 디저트 라운지
INSERT INTO places (slug,name,region,category,one_liner,atmosphere_desc,recommended_situations,detailed_review,price_range,hours,cover_image_url,is_published,source,bookmark_count,view_count)
VALUES ('hoegi-dessert','회기 디저트 라운지','회기','dessert','경희대 앞 딸기 케이크 맛집, 사진 찍고 싶은 플레이팅',
'경희대학교 정문 앞 골목에 자리한 디저트 카페. 계절 과일을 활용한 케이크와 타르트가 예술 작품처럼 아름답습니다.',
ARRAY['소개팅 마지막 코스로 달콤한 디저트 타임 추천해요.','친구 생일 케이크 사기에도 딱이에요.'],
'주인이 파티시에 출신으로 매일 신선한 재료로 케이크를 만듭니다. 딸기 시즌(12~4월)에는 특히 딸기 쇼트케이크가 일품이며, 하루에 수량이 한정되어 있습니다.',
'₩₩','12:00 - 21:00','https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80',true,'default',190,4100)
ON CONFLICT (slug) DO NOTHING RETURNING id INTO p;
IF p IS NOT NULL THEN
  INSERT INTO place_tags (place_id,tag_id) SELECT p,id FROM tags WHERE slug IN ('emotional','instagram','date','first-date','dessert');
  INSERT INTO place_images (place_id,image_url,alt_text,display_order) VALUES
    (p,'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80','딸기 케이크',0),
    (p,'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80','디저트 플레이팅',1);
END IF;

-- p10: 신촌 다방
INSERT INTO places (slug,name,region,category,one_liner,atmosphere_desc,recommended_situations,detailed_review,price_range,hours,cover_image_url,is_published,source,bookmark_count,view_count)
VALUES ('sinchon-teahouse','신촌 다방','신촌','cafe','전통 다방 분위기의 힙한 티하우스',
'1980년대 한국 다방을 현대적으로 재해석한 공간. 체크 무늬 커버와 나무 의자, 레트로 타일이 향수를 자극합니다. 전통차와 식혜, 수정과 등 한국 음료가 주력 메뉴.',
ARRAY['외국인 친구 데려오면 진짜 좋아해요.','독특한 분위기에서 공부하고 싶을 때 와요.'],
'신촌 연대 앞 골목에 자리한 이 티하우스는 전통과 힙함이 공존하는 특별한 공간입니다. 쌍화차, 대추차, 오미자차 등 전통 음료가 3,000~5,000원 선으로 착합니다.',
'₩','11:00 - 22:00','https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=80',true,'default',73,1540)
ON CONFLICT (slug) DO NOTHING RETURNING id INTO p;
IF p IS NOT NULL THEN
  INSERT INTO place_tags (place_id,tag_id) SELECT p,id FROM tags WHERE slug IN ('vintage','cozy','solo','work','budget');
  INSERT INTO place_images (place_id,image_url,alt_text,display_order) VALUES
    (p,'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=80','다방 내부',0),
    (p,'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80','전통차',1);
END IF;

-- p11: 이태원 비건 키친
INSERT INTO places (slug,name,region,category,one_liner,atmosphere_desc,recommended_situations,detailed_review,price_range,hours,cover_image_url,is_published,source,bookmark_count,view_count)
VALUES ('itaewon-vegan','이태원 비건 키친','이태원','restaurant','채식인도, 비채식인도 만족하는 글로벌 비건 레스토랑',
'이태원의 다양한 문화가 녹아든 비건 레스토랑. 밝고 모던한 인테리어에 다국적 메뉴 구성이 흥미롭습니다.',
ARRAY['채식주의자 친구와 함께 오기 완벽해요.','건강하게 먹고 싶은 날 최고의 선택이에요.'],
'이태원역 4번 출구 도보 3분. 버섯 스테이크, 두부 타코, 아사이볼 등 다양한 비건 메뉴를 제공합니다. 글루텐 프리 옵션도 있습니다.',
'₩₩','11:30 - 21:30','https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',true,'default',62,1320)
ON CONFLICT (slug) DO NOTHING RETURNING id INTO p;
IF p IS NOT NULL THEN
  INSERT INTO place_tags (place_id,tag_id) SELECT p,id FROM tags WHERE slug IN ('modern','bright','group','solo');
  INSERT INTO place_images (place_id,image_url,alt_text,display_order) VALUES
    (p,'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80','비건 요리',0);
END IF;

-- p12: 여의도 피크닉 카페
INSERT INTO places (slug,name,region,category,one_liner,atmosphere_desc,recommended_situations,detailed_review,price_range,hours,cover_image_url,is_published,source,bookmark_count,view_count)
VALUES ('yeouido-picnic-cafe','여의도 피크닉 카페','여의도','cafe','한강 바로 옆, 피크닉 도시락을 파는 이색 카페',
'여의도 한강공원 입구에 자리한 특별한 카페로, 커피와 함께 피크닉 도시락 세트를 구성해서 한강에서 즐길 수 있습니다.',
ARRAY['봄·가을 한강 나들이 코스로 최고예요.','가족, 연인, 친구 모두와 즐길 수 있는 장소예요.'],
'여의도역 1번 출구에서 도보 7분. 피크닉 세트는 샌드위치, 과일, 음료로 구성되며 2인 세트 기준 25,000원입니다.',
'₩₩','10:00 - 19:00','https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&q=80',true,'default',134,2760)
ON CONFLICT (slug) DO NOTHING RETURNING id INTO p;
IF p IS NOT NULL THEN
  INSERT INTO place_tags (place_id,tag_id) SELECT p,id FROM tags WHERE slug IN ('bright','nature','date','group','instagram');
  INSERT INTO place_images (place_id,image_url,alt_text,display_order) VALUES
    (p,'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&q=80','한강 피크닉',0);
END IF;

-- p13: 경복궁 한복 찻집
INSERT INTO places (slug,name,region,category,one_liner,atmosphere_desc,recommended_situations,detailed_review,price_range,hours,cover_image_url,is_published,source,bookmark_count,view_count)
VALUES ('gyeongbok-hanbok','경복궁 한복 찻집','경복궁','cafe','한복 입고 전통 찻집에서 즐기는 오후 한때',
'경복궁 앞 한옥 찻집에서 한복을 무료로 대여해 차 한 잔의 여유를 즐기는 특별한 경험. 고즈넉한 마당과 기와지붕 아래서 전통 음료를 마시면 시간이 멈추는 것 같습니다.',
ARRAY['외국인 친구나 지방에서 올라온 가족과 함께 오기 좋아요.','특별한 날 한복 사진 찍기에 완벽해요.'],
'경복궁역 3번 출구 도보 5분. 한복 대여는 무료이며 찻집 이용 시 자동으로 제공됩니다. 쌍화탕, 모과차, 식혜 등 전통 음료가 메인이며, 약과·다식 세트가 함께 제공됩니다.',
'₩₩','10:00 - 18:00','https://images.unsplash.com/photo-1548625149-720754d445bb?w=800&q=80',true,'default',219,4780)
ON CONFLICT (slug) DO NOTHING RETURNING id INTO p;
IF p IS NOT NULL THEN
  INSERT INTO place_tags (place_id,tag_id) SELECT p,id FROM tags WHERE slug IN ('vintage','emotional','instagram','date','first-date');
  INSERT INTO place_images (place_id,image_url,alt_text,display_order) VALUES
    (p,'https://images.unsplash.com/photo-1548625149-720754d445bb?w=800&q=80','한옥 찻집',0);
END IF;

-- p14: 동대문 24시 라멘집
INSERT INTO places (slug,name,region,category,one_liner,atmosphere_desc,recommended_situations,detailed_review,price_range,hours,cover_image_url,is_published,source,bookmark_count,view_count)
VALUES ('dongdaemun-24h-ramen','동대문 24시 라멘집','동대문','restaurant','새벽 4시도 열려있는 진한 돈코츠 라멘집',
'동대문 쇼핑 후 새벽에 출출할 때 찾는 24시간 운영 라멘집. 카운터석으로만 구성된 좁고 긴 공간이지만, 주방에서 바로 나오는 라멘의 온도가 제격입니다.',
ARRAY['쇼핑 후 늦은 밤 배고플 때 유일한 선택이에요.','혼자서도 전혀 어색하지 않은 카운터석 구조예요.'],
'동대문역사문화공원역 1번 출구 도보 1분. 돈코츠 라멘 한 가지 메뉴만 운영하며 가격은 9,000원입니다. 육수를 16시간 이상 끓여 진하고 깊은 맛이 납니다.',
'₩','24시간','https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80',true,'default',89,2100)
ON CONFLICT (slug) DO NOTHING RETURNING id INTO p;
IF p IS NOT NULL THEN
  INSERT INTO place_tags (place_id,tag_id) SELECT p,id FROM tags WHERE slug IN ('quiet','solo','budget','latenight');
  INSERT INTO place_images (place_id,image_url,alt_text,display_order) VALUES
    (p,'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80','라멘',0);
END IF;

-- p15: 북촌 아트 카페
INSERT INTO places (slug,name,region,category,one_liner,atmosphere_desc,recommended_situations,detailed_review,price_range,hours,cover_image_url,is_published,source,bookmark_count,view_count)
VALUES ('bukchon-art-cafe','북촌 아트 카페','북촌','cafe','한옥 갤러리 카페, 로컬 아티스트 작품 상설 전시',
'북촌 한옥마을 내에 자리한 갤러리 겸 카페로, 젊은 로컬 아티스트들의 작품이 상설 전시됩니다. 전통 한옥 구조를 살린 공간에 현대 미술이 어우러진 독특한 분위기.',
ARRAY['예술적 감성을 충전하고 싶은 날 최고예요.','사진작가 친구와 함께 오면 즐거운 시간 보장이에요.'],
'안국역 2번 출구 도보 10분, 북촌 8경 코스 중간에 위치합니다. 카페 내 작품은 구매도 가능하며, 매달 새로운 작가의 전시로 바뀝니다. 핸드드립 커피와 플레인 스콘이 시그니처 메뉴입니다.',
'₩₩','10:00 - 19:00','https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80',true,'default',143,3050)
ON CONFLICT (slug) DO NOTHING RETURNING id INTO p;
IF p IS NOT NULL THEN
  INSERT INTO place_tags (place_id,tag_id) SELECT p,id FROM tags WHERE slug IN ('emotional','quiet','instagram','date','solo');
  INSERT INTO place_images (place_id,image_url,alt_text,display_order) VALUES
    (p,'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80','갤러리 카페',0),
    (p,'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80','핸드드립 커피',1);
END IF;

END;
$$;
