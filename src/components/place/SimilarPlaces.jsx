/**
 * SimilarPlaces.jsx
 * 장소 상세 페이지 하단의 "이런 곳도 좋아요" 섹션
 *
 * - 현재 장소의 태그 slug들로 유사 장소를 찾습니다.
 * - 현재 장소는 제외합니다.
 *
 * Props:
 *   - currentPlaceId: string
 *   - tagSlugs: string[]
 */

import { Link } from 'react-router-dom'
import { usePlaces } from '../../hooks/usePlaces'
import PlaceCard from './PlaceCard'

export default function SimilarPlaces({ currentPlaceId, tagSlugs = [] }) {
  const { data: places, loading } = usePlaces({
    tags: tagSlugs.slice(0, 2), // 상위 2개 태그로 유사 장소 검색
    exclude: currentPlaceId,
    limit: 4,
  })

  if (loading || !places.length) return null

  return (
    <section style={{ marginTop: '48px', paddingTop: '40px', borderTop: '1px solid #EDE8E2' }}>
      <h2
        style={{
          fontSize: '18px',
          fontWeight: 700,
          color: '#2C2C2C',
          marginBottom: '20px',
        }}
      >
        이런 곳도 좋아요 ✨
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '20px',
        }}
      >
        {places.slice(0, 4).map(place => (
          <PlaceCard key={place.id} place={place} size="compact" showBookmark={false} />
        ))}
      </div>
    </section>
  )
}
