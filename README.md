# Vibe Seoul — 분위기로 찾는 서울의 카페 & 맛집

> 별점 대신 감성으로, 위치 대신 경험으로 서울의 장소를 발견하는 콘텐츠형 플랫폼

---

## 서비스 소개

**Vibe Seoul**은 대학생과 20대를 위한 장소 탐색 웹 서비스입니다.
맛집과 카페를 단순한 별점이나 위치 정보가 아닌, **분위기와 상황 중심**으로 발견할 수 있도록 설계했습니다.

- 데이트, 혼밥, 작업, 친구 모임 등 **상황별 장소 추천**
- 조용한, 감성적인, 빈티지한 등 **분위기 태그 탐색**
- 에디터가 직접 엮은 **큐레이션 콘텐츠**
- 마음에 드는 장소를 **북마크**로 저장

---

## 기술 스택

| 항목 | 기술 |
|------|------|
| 프레임워크 | React 18 + Vite |
| 라우팅 | React Router v6 |
| 스타일링 | Tailwind CSS v4 |
| 백엔드/인증 | Supabase (선택) |
| 폰트 | Pretendard Variable |

---

## 로컬 실행 방법

### 1. 패키지 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

> **Supabase 없이도 바로 실행됩니다!**
> `src/data/sampleData.js`의 로컬 샘플 데이터(15개 장소, 4개 큐레이션)가 자동으로 사용됩니다.

---

## Supabase 연동 방법 (선택)

실제 DB를 사용하려면 아래 단계를 따르세요.

### 1. Supabase 프로젝트 생성

[https://supabase.com](https://supabase.com) 에서 새 프로젝트 생성

### 2. 스키마 적용

`supabase/schema.sql` 내용을 Supabase 대시보드 > **SQL Editor**에 붙여넣고 실행

### 3. 환경 변수 설정

```bash
cp .env.example .env.local
```

`.env.local` 파일에 Supabase 키 입력:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. 인증 설정

Supabase 대시보드 > **Authentication > Settings** 에서:
- Email Auth 활성화
- Site URL을 개발 주소(`http://localhost:5173`)로 설정

---

## 폴더 구조

```
vibe-seoul/
├── src/
│   ├── components/
│   │   ├── common/        # Tag, Badge, Spinner, EmptyState — 재사용 원자 컴포넌트
│   │   ├── layout/        # Navbar, Footer, PageWrapper, ProtectedRoute — 구조 컴포넌트
│   │   ├── place/         # PlaceCard, PlaceGrid, PhotoGallery, BookmarkButton, SimilarPlaces
│   │   ├── home/          # HeroBanner, TagNavBar, SectionHeader
│   │   ├── curation/      # CurationCard, CurationGrid
│   │   └── auth/          # LoginForm
│   ├── pages/             # 8개 페이지 컴포넌트
│   ├── hooks/             # usePlaces, usePlaceDetail, useBookmarks, useCurations, useSearch
│   ├── context/           # AuthContext (전역 인증 상태)
│   ├── lib/               # supabase.js (클라이언트 싱글턴), constants.js
│   ├── data/              # sampleData.js (15개 장소 + 4개 큐레이션 로컬 데이터)
│   └── utils/             # tagColors.js (태그 색상 맵), formatters.js
├── supabase/
│   └── schema.sql         # Supabase DB 스키마 + RLS 정책 + 트리거
├── .env.example           # 환경 변수 템플릿
└── README.md
```

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 홈 화면 | 히어로 배너, 태그 네비게이션, 최신/인기 장소, 큐레이션 |
| 장소 목록 | 태그 필터링, 검색, 정렬 (URL 파라미터 기반) |
| 장소 상세 | 포토 갤러리, 분위기 설명, 추천 상황, 유사 장소 |
| 태그 탐색 | 분위기·상황별 태그 카드 그리드 |
| 큐레이션 | 에디터 추천 장소 컬렉션 |
| 로그인 | 이메일 매직 링크 (Supabase) / 데모 모드 |
| 북마크 | 장소 저장 및 목록 확인 |

---

## 기술적 특징

- **URL 기반 필터링** — `?tag=date&sort=popular` 형태로 필터 상태를 URL에 저장해 카카오톡으로 공유 가능
- **낙관적 업데이트** — 북마크 버튼 클릭 시 서버 응답 전에 즉시 UI 반영
- **디바운스 검색** — 350ms 지연으로 불필요한 요청 방지
- **로컬 우선 아키텍처** — Supabase 미설정 시 자동으로 로컬 샘플 데이터 사용
- **한국어 최적화** — Pretendard 폰트, `word-break: keep-all` 적용

---

## 배포 (Vercel 권장)

```bash
npm run build
```

Vercel에서 `dist/` 폴더 배포 후 환경 변수 설정, Supabase Site URL을 배포 URL로 변경.

---

## 라이선스

MIT License — 포트폴리오 프로젝트
