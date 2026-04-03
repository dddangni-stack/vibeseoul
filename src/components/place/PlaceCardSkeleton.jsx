/**
 * PlaceCardSkeleton.jsx
 * 장소 카드 로딩 상태 스켈레톤
 */

export default function PlaceCardSkeleton() {
  return (
    <div
      style={{
        backgroundColor: '#fff',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid #EDE8E2',
      }}
    >
      {/* 이미지 영역 */}
      <div className="skeleton" style={{ paddingTop: '66.67%', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0 }} />
      </div>
      {/* 텍스트 영역 */}
      <div style={{ padding: '16px' }}>
        <div className="skeleton" style={{ height: '18px', width: '40%', marginBottom: '10px' }} />
        <div className="skeleton" style={{ height: '20px', width: '80%', marginBottom: '8px' }} />
        <div className="skeleton" style={{ height: '16px', width: '100%', marginBottom: '4px' }} />
        <div className="skeleton" style={{ height: '16px', width: '70%', marginBottom: '14px' }} />
        <div style={{ display: 'flex', gap: '6px' }}>
          <div className="skeleton" style={{ height: '22px', width: '60px', borderRadius: '100px' }} />
          <div className="skeleton" style={{ height: '22px', width: '70px', borderRadius: '100px' }} />
        </div>
      </div>
    </div>
  )
}
