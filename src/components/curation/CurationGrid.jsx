/**
 * CurationGrid.jsx
 * 큐레이션 카드 그리드 래퍼
 *
 * Props:
 *   - curations: 큐레이션 배열
 *   - loading: boolean
 */

import CurationCard from './CurationCard'

export default function CurationGrid({ curations = [], loading = false }) {
  if (loading) {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="skeleton"
            style={{ height: '220px', borderRadius: '16px' }}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px',
      }}
    >
      {curations.map(curation => (
        <CurationCard key={curation.id} curation={curation} />
      ))}
    </div>
  )
}
