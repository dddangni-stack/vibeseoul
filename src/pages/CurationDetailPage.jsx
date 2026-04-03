/**
 * CurationDetailPage.jsx
 * 큐레이션 상세 페이지
 *
 * - 큐레이션 제목/설명/커버 이미지
 * - 포함된 장소 카드 목록 (순서 있음)
 */

import { useParams, useNavigate } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import PlaceCard from '../components/place/PlaceCard'
import Spinner from '../components/common/Spinner'
import { useCurationDetail } from '../hooks/useCurations'

export default function CurationDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { curation, places, loading, error } = useCurationDetail(slug)

  if (loading) return <Spinner />
  if (error || !curation) {
    return (
      <PageWrapper>
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
          <p style={{ fontSize: '16px', fontWeight: 600, color: '#2C2C2C' }}>
            큐레이션을 찾을 수 없어요
          </p>
        </div>
      </PageWrapper>
    )
  }

  return (
    <>
      {/* 풀블리드 커버 영역 */}
      <div
        style={{
          position: 'relative',
          height: '320px',
          overflow: 'hidden',
          backgroundColor: '#2C2C2C',
        }}
      >
        {curation.cover_image_url && (
          <img
            src={curation.cover_image_url}
            alt={curation.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.55,
            }}
          />
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(44,44,44,0.9) 0%, transparent 60%)',
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          <div
            style={{
              maxWidth: '1100px',
              width: '100%',
              margin: '0 auto',
              padding: '0 20px 32px',
            }}
          >
            <button
              onClick={() => navigate(-1)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                color: 'rgba(250,248,245,0.7)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                marginBottom: '16px',
                fontFamily: 'inherit',
              }}
            >
              ← 큐레이션 목록
            </button>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#C1714F',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              ✨ Curation
            </div>
            <h1
              style={{
                fontSize: 'clamp(22px, 4vw, 34px)',
                fontWeight: 800,
                color: '#FAF8F5',
                letterSpacing: '-0.5px',
                marginBottom: '6px',
                lineHeight: 1.2,
              }}
            >
              {curation.title}
            </h1>
            {curation.subtitle && (
              <p style={{ fontSize: '15px', color: 'rgba(250,248,245,0.75)' }}>
                {curation.subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      <PageWrapper>
        {/* 큐레이션 소개글 */}
        {curation.description && (
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '36px',
              border: '1px solid #EDE8E2',
            }}
          >
            <p style={{ fontSize: '15px', color: '#5C5C5C', lineHeight: 1.8 }}>
              {curation.description}
            </p>
          </div>
        )}

        {/* 장소 목록 */}
        <div>
          <h2
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: '#2C2C2C',
              marginBottom: '20px',
            }}
          >
            장소 {places.length}곳
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {places.map((place, index) => (
              <div key={place.id}>
                {/* 순서 번호 */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '10px',
                  }}
                >
                  <span
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#C1714F',
                      color: '#FAF8F5',
                      fontSize: '12px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </span>
                  {/* 에디터 노트 */}
                  {(curation.place_notes?.[place.id] || place._note) && (
                    <span style={{ fontSize: '12px', color: '#8C8070', fontStyle: 'italic' }}>
                      {curation.place_notes?.[place.id] || place._note}
                    </span>
                  )}
                </div>
                <PlaceCard place={place} showBookmark={true} />
              </div>
            ))}
          </div>
        </div>
      </PageWrapper>
    </>
  )
}
