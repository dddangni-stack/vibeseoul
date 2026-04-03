/**
 * PlaceGrid.jsx
 * 장소 카드를 반응형 그리드로 렌더링하는 컴포넌트
 *
 * Props:
 *   - places: 장소 배열
 *   - loading: boolean
 *   - skeletonCount: number (로딩 중 표시할 스켈레톤 수)
 *   - showBookmark: boolean
 *   - emptyMessage: string
 *   - onEdit: (place) => void — 수정 버튼 클릭 시 콜백
 */

import PlaceCard from './PlaceCard'
import PlaceCardSkeleton from './PlaceCardSkeleton'
import EmptyState from '../common/EmptyState'

const GRID_STYLE = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '24px',
}

export default function PlaceGrid({
  places = [],
  loading = false,
  skeletonCount = 6,
  showBookmark = true,
  emptyMessage = '조건에 맞는 장소가 없어요',
  emptyDescription = '다른 태그나 검색어로 찾아보세요 🌿',
  onEdit,
}) {
  if (loading) {
    return (
      <div style={GRID_STYLE}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <PlaceCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!places.length) {
    return (
      <EmptyState
        icon="🔍"
        message={emptyMessage}
        description={emptyDescription}
      />
    )
  }

  return (
    <div style={GRID_STYLE}>
      {places.map(place => (
        <PlaceCard
          key={place.id}
          place={place}
          showBookmark={showBookmark}
          onEdit={onEdit}
        />
      ))}
    </div>
  )
}
