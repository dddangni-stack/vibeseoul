/**
 * PhotoGallery.jsx
 * 장소 상세 페이지의 이미지 갤러리 컴포넌트
 *
 * - 모바일: CSS scroll-snap 가로 스크롤
 * - 데스크탑(640px+): 메인 이미지 + 사이드 그리드 레이아웃
 *
 * Props:
 *   - images: [{ image_url, alt_text }]
 *   - placeName: string
 */

import { useState } from 'react'

export default function PhotoGallery({ images = [], placeName = '' }) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!images.length) return null

  return (
    <div>
      {/* 모바일: 가로 스크롤 갤러리 */}
      <div
        className="gallery-container scrollbar-hide"
        style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '8px',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        {/* 데스크탑에서는 첫 번째 이미지만 크게 표시 */}
        <div
          className="gallery-item"
          style={{
            position: 'relative',
            minWidth: '100%',
            height: '420px',
            overflow: 'hidden',
            borderRadius: '16px',
            backgroundColor: '#F2EDE6',
          }}
        >
          <img
            src={images[activeIndex]?.image_url}
            alt={images[activeIndex]?.alt_text || placeName}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'opacity 0.3s ease',
            }}
            onError={e => {
              e.target.src = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=70'
            }}
          />

          {/* 이미지 인덱스 표시 */}
          {images.length > 1 && (
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                right: '16px',
                backgroundColor: 'rgba(44,44,44,0.6)',
                color: '#FAF8F5',
                fontSize: '12px',
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: '100px',
              }}
            >
              {activeIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </div>

      {/* 썸네일 네비게이션 (이미지 2장 이상일 때) */}
      {images.length > 1 && (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginTop: '10px',
            overflowX: 'auto',
          }}
          className="scrollbar-hide"
        >
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              style={{
                flexShrink: 0,
                width: '72px',
                height: '72px',
                borderRadius: '10px',
                overflow: 'hidden',
                border: i === activeIndex ? '2px solid #C1714F' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'border-color 0.15s',
                backgroundColor: '#F2EDE6',
                padding: 0,
              }}
            >
              <img
                src={img.image_url}
                alt={img.alt_text || `${placeName} 사진 ${i + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => {
                  e.target.src = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&q=60'
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
