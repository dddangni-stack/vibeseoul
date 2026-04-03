/**
 * CurationCard.jsx
 * 큐레이션 카드 컴포넌트
 * 여러 장소를 하나의 테마로 묶은 콘텐츠 카드
 *
 * Props:
 *   - curation: { slug, title, subtitle, cover_image_url, place_ids }
 */

import { Link } from 'react-router-dom'

export default function CurationCard({ curation }) {
  const coverImage = curation.cover_image_url ||
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80'

  const placeCount = curation.place_ids?.length || 0

  return (
    <Link
      to={`/curations/${curation.slug}`}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div
        className="card-hover"
        style={{
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          height: '220px',
          backgroundColor: '#2C2C2C',
        }}
      >
        {/* 배경 이미지 */}
        <img
          src={coverImage}
          alt={curation.title}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.65,
            transition: 'transform 0.4s ease, opacity 0.3s ease',
          }}
          onError={e => {
            e.target.src = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80'
          }}
        />

        {/* 그라디언트 오버레이 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(44,44,44,0.9) 0%, rgba(44,44,44,0.2) 60%, transparent 100%)',
          }}
        />

        {/* 콘텐츠 */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '20px',
          }}
        >
          {placeCount > 0 && (
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'rgba(250,248,245,0.7)',
                letterSpacing: '0.5px',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              장소 {placeCount}곳 ·
            </span>
          )}
          <h3
            style={{
              fontSize: '17px',
              fontWeight: 800,
              color: '#FAF8F5',
              marginBottom: '4px',
              letterSpacing: '-0.3px',
            }}
          >
            {curation.title}
          </h3>
          {curation.subtitle && (
            <p
              style={{
                fontSize: '12px',
                color: 'rgba(250,248,245,0.75)',
                lineHeight: 1.4,
              }}
              className="line-clamp-2"
            >
              {curation.subtitle}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
