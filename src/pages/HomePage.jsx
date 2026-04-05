/**
 * HomePage.jsx
 * 잡지 에디토리얼 스타일 홈 페이지
 *
 * 구성:
 * 1. 잡지 커버 히어로 (HeroBanner)
 * 2. 태그 탐색 스트립 (가로 스크롤)
 * 3. 피처 섹션: 최신/필터 장소 — 에디토리얼 그리드
 * 4. 풀블리드 큐레이션 섹션
 * 5. 인기 장소 그리드
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import HeroBanner from '../components/home/HeroBanner'
import PlaceCard from '../components/place/PlaceCard'
import PlaceCardSkeleton from '../components/place/PlaceCardSkeleton'
import CurationCard from '../components/curation/CurationCard'
import { usePlaces } from '../hooks/usePlaces'
import { useCurations } from '../hooks/useCurations'
import { TAGS } from '../lib/tags'
import { getTagColor } from '../utils/tagColors'

export default function HomePage() {
  const [activeTag, setActiveTag] = useState(null)

  const { data: filteredPlaces, loading: placesLoading } = usePlaces({
    tags: activeTag ? [activeTag] : [],
    sort: 'latest',
    limit: 6,
  })

  const { data: popularPlaces, loading: popularLoading } = usePlaces({
    sort: 'popular',
    limit: 3,
  })

  const { data: curations, loading: curationsLoading } = useCurations({ limit: 4 })

  const moodTags = TAGS.filter(t => t.type === 'mood')
  const situationTags = TAGS.filter(t => t.type === 'situation')
  const allHomeTags = [...moodTags, ...situationTags].slice(0, 12)
  const activeTagObj = TAGS.find(t => t.slug === activeTag)

  return (
    <div>
      {/* ══ 잡지 커버 히어로 ══ */}
      <HeroBanner />

      {/* ══ 태그 스트립 ══ */}
      <div
        style={{
          borderBottom: '2px solid #2C2C2C',
          padding: '16px 0',
          backgroundColor: '#FAF8F5',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>

          {/* 섹션 라벨 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span
              style={{
                fontSize: '9px',
                fontWeight: 800,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#B5ADA3',
              }}
            >
              Find by Tag
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#EDE8E2' }} />
          </div>

          {/* 태그 버튼들 */}
          <div
            style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}
            className="scrollbar-hide"
          >
            {/* 전체 버튼 */}
            <button
              onClick={() => setActiveTag(null)}
              style={{
                flexShrink: 0,
                padding: '6px 14px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.5px',
                border: '1.5px solid',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s',
                backgroundColor: activeTag === null ? '#2C2C2C' : '#FAF8F5',
                color: activeTag === null ? '#FAF8F5' : '#5C5C5C',
                borderColor: activeTag === null ? '#2C2C2C' : '#D0C8BE',
              }}
            >
              🗺️ ALL
            </button>

            {allHomeTags.map(tag => {
              const colors = getTagColor(tag.slug)
              const isActive = activeTag === tag.slug
              return (
                <button
                  key={tag.id}
                  onClick={() => setActiveTag(isActive ? null : tag.slug)}
                  style={{
                    flexShrink: 0,
                    padding: '6px 14px',
                    fontSize: '11px',
                    fontWeight: isActive ? 700 : 500,
                    border: '1.5px solid',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.15s',
                    backgroundColor: isActive ? '#2C2C2C' : colors.bg,
                    color: isActive ? '#FAF8F5' : colors.text,
                    borderColor: isActive ? '#2C2C2C' : colors.border,
                  }}
                >
                  {tag.emoji} {tag.name_ko}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ══ 피처 섹션: 최신 / 태그 장소 ══ */}
      <section style={{ padding: '40px 0', borderBottom: '2px solid #2C2C2C' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>

          {/* 섹션 헤더 — 잡지 스타일 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: '1px solid #EDE8E2',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  letterSpacing: '2px',
                  color: '#C1714F',
                  textTransform: 'uppercase',
                }}
              >
                {activeTagObj ? `# ${activeTagObj.name_ko}` : 'Latest'}
              </span>
              <h2
                style={{
                  fontSize: 'clamp(22px, 4vw, 34px)',
                  fontWeight: 900,
                  color: '#2C2C2C',
                  letterSpacing: '-1px',
                  fontStyle: 'italic',
                }}
              >
                {activeTagObj
                  ? `'${activeTagObj.emoji} ${activeTagObj.name_ko}' 장소`
                  : '최근 등록된 장소'}
              </h2>
            </div>
            <Link
              to={activeTag ? `/places?tag=${activeTag}` : '/places'}
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#2C2C2C',
                textDecoration: 'none',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                borderBottom: '2px solid #C1714F',
                paddingBottom: '2px',
              }}
            >
              전체보기 →
            </Link>
          </div>

          {/* 에디토리얼 그리드: 첫 번째 카드는 크게 */}
          {placesLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {Array.from({ length: 6 }).map((_, i) => <PlaceCardSkeleton key={i} />)}
            </div>
          ) : (
            <EditorialGrid places={filteredPlaces} />
          )}
        </div>
      </section>

      {/* ══ 큐레이션 섹션 — 잡지 피처 스타일 ══ */}
      <section style={{ padding: '40px 0', backgroundColor: '#2C2C2C', borderBottom: '2px solid #444' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>

          {/* 섹션 헤더 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: '1px solid #3C3C3C',
            }}
          >
            <div>
              <div style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '2px', color: '#C1714F', textTransform: 'uppercase', marginBottom: '6px' }}>
                Editor's Pick
              </div>
              <h2
                style={{
                  fontSize: 'clamp(22px, 4vw, 34px)',
                  fontWeight: 900,
                  color: '#FAF8F5',
                  letterSpacing: '-1px',
                  fontStyle: 'italic',
                }}
              >
                에디터 큐레이션
              </h2>
            </div>
            <Link
              to="/curations"
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#FAF8F5',
                textDecoration: 'none',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                borderBottom: '2px solid #C1714F',
                paddingBottom: '2px',
              }}
            >
              모두 보기 →
            </Link>
          </div>

          {/* 큐레이션 그리드 */}
          {curationsLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ height: '220px', backgroundColor: '#3C3C3C', borderRadius: '4px' }} />
              ))}
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '16px',
              }}
            >
              {curations.map(c => <CurationCard key={c.id} curation={c} />)}
            </div>
          )}
        </div>
      </section>

      {/* ══ 인기 장소 섹션 ══ */}
      <section style={{ padding: '40px 0 56px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>

          {/* 섹션 헤더 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: '1px solid #EDE8E2',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
              <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '2px', color: '#C1714F', textTransform: 'uppercase' }}>
                Hot Now
              </span>
              <h2 style={{ fontSize: 'clamp(22px, 4vw, 34px)', fontWeight: 900, color: '#2C2C2C', letterSpacing: '-1px', fontStyle: 'italic' }}>
                지금 인기 있는 곳
              </h2>
            </div>
            <Link
              to="/places?sort=popular"
              style={{ fontSize: '11px', fontWeight: 700, color: '#2C2C2C', textDecoration: 'none', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '2px solid #C1714F', paddingBottom: '2px' }}
            >
              더보기 →
            </Link>
          </div>

          {/* 3열 그리드 */}
          {popularLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {[1, 2, 3].map(i => <PlaceCardSkeleton key={i} />)}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {popularPlaces.map(p => <PlaceCard key={p.id} place={p} showBookmark />)}
            </div>
          )}
        </div>
      </section>

    </div>
  )
}

/* ──────────────────────────────────────────────────────
   EditorialGrid — 잡지식 비대칭 레이아웃
   첫 번째 장소는 크게, 나머지는 소형 그리드로
   ────────────────────────────────────────────────────── */
function EditorialGrid({ places }) {
  if (!places || places.length === 0) return (
    <div style={{ textAlign: 'center', padding: '60px', color: '#8C8070' }}>
      조건에 맞는 장소가 없어요 🔍
    </div>
  )

  const [featured, ...rest] = places

  return (
    <div className="editorial-grid">
      {/* 피처 카드: 2열 차지 */}
      {featured && (
        <div className="featured">
          <FeaturedPlaceCard place={featured} />
        </div>
      )}

      {/* 우측: 작은 카드들 */}
      {rest.slice(0, 2).map(p => (
        <PlaceCard key={p.id} place={p} showBookmark size="compact" />
      ))}

      {/* 나머지 */}
      {rest.slice(2, 5).map(p => (
        <PlaceCard key={p.id} place={p} showBookmark />
      ))}
    </div>
  )
}

/* 피처 장소 카드 — 큰 이미지 + 잡지 스타일 텍스트 */
import { getPlaceTags } from '../lib/tags'
import Badge from '../components/common/Badge'
import Tag from '../components/common/Tag'
import BookmarkButton from '../components/place/BookmarkButton'

function FeaturedPlaceCard({ place }) {
  const tags = place.place_tags
    ? place.place_tags.map(pt => pt.tags).filter(Boolean)
    : getPlaceTags(place)

  return (
    <Link to={`/places/${place.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        className="card-hover"
        style={{
          position: 'relative',
          height: '100%',
          minHeight: '360px',
          overflow: 'hidden',
          backgroundColor: '#1A1A1A',
        }}
      >
        {/* 배경 이미지 */}
        <img
          src={place.cover_image_url}
          alt={place.name}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
          onMouseEnter={e => { e.target.style.transform = 'scale(1.03)' }}
          onMouseLeave={e => { e.target.style.transform = 'scale(1)' }}
        />

        {/* 하단 그라디언트 오버레이 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(20,18,16,0.92) 0%, rgba(20,18,16,0.4) 45%, transparent 70%)',
          }}
        />

        {/* 가격 배지 */}
        {place.price_range && (
          <div style={{ position: 'absolute', top: '14px', left: '14px' }}>
            <Badge variant="price">{place.price_range}</Badge>
          </div>
        )}

        {/* 북마크 버튼 */}
        <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
          <BookmarkButton placeId={place.id} />
        </div>

        {/* 피처 레이블 */}
        <div
          style={{
            position: 'absolute',
            top: '14px',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <span
            style={{
              backgroundColor: '#C1714F',
              color: '#FAF8F5',
              fontSize: '9px',
              fontWeight: 800,
              letterSpacing: '2px',
              padding: '3px 10px',
              textTransform: 'uppercase',
            }}
          >
            ★ Feature
          </span>
        </div>

        {/* 하단 콘텐츠 */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '24px',
          }}
        >
          <div style={{ marginBottom: '8px' }}>
            <Badge variant="region">{place.region}</Badge>
          </div>
          <h3
            style={{
              fontSize: 'clamp(20px, 3vw, 28px)',
              fontWeight: 900,
              color: '#FAF8F5',
              letterSpacing: '-0.5px',
              fontStyle: 'italic',
              marginBottom: '6px',
              lineHeight: 1.2,
            }}
          >
            {place.name}
          </h3>
          <p
            style={{
              fontSize: '13px',
              color: 'rgba(250,248,245,0.75)',
              marginBottom: '12px',
              lineHeight: 1.5,
            }}
            className="line-clamp-2"
          >
            {place.one_liner}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {tags.slice(0, 4).map(tag => (
              <span
                key={tag.id || tag.slug}
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  color: 'rgba(250,248,245,0.8)',
                  backgroundColor: 'rgba(250,248,245,0.15)',
                  border: '1px solid rgba(250,248,245,0.25)',
                  padding: '3px 10px',
                }}
              >
                {tag.emoji} {tag.name_ko}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
