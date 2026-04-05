/**
 * CurationDetailPage.jsx
 * 큐레이션 상세 페이지
 *
 * - 큐레이션 제목/설명/커버 이미지
 * - 포함된 장소 카드 목록 (순서 있음)
 * - 소유자/admin: 수정/삭제 버튼
 */

import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import PlaceCard from '../components/place/PlaceCard'
import Spinner from '../components/common/Spinner'
import CurationFormModal from '../components/curation/CurationFormModal'
import { useCurationDetail } from '../hooks/useCurations'
import { usePlaceStore } from '../context/PlaceStoreContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function CurationDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { curation, places, loading, error } = useCurationDetail(slug)
  const { triggerCurationRefresh } = usePlaceStore()
  const { user, isAdmin } = useAuth()

  const [modalOpen, setModalOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

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

  const canEdit = Boolean(user && (curation.user_id === user.id || isAdmin))

  async function handleDelete() {
    if (!supabase) return
    await supabase.from('curations').delete().eq('id', curation.id)
    triggerCurationRefresh()
    navigate('/curations')
  }

  // CurationFormModal에서 수정 모드로 열기 위해 curation_places 데이터를 initialData에 포함
  const editData = modalOpen
    ? {
        ...curation,
        curation_places: (curation.curation_places || []).map(cp => ({
          ...cp,
          places: places.find(p => p.id === cp.place_id) || cp.places,
        })),
      }
    : null

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
        {/* 수정/삭제 버튼 (소유자/admin) */}
        {canEdit && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            <button
              onClick={() => setModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 18px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#5C5C5C',
                backgroundColor: '#FAF8F5',
                border: '1.5px solid #EDE8E2',
                borderRadius: '100px',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              수정
            </button>

            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 18px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#B5ADA3',
                  backgroundColor: 'transparent',
                  border: '1.5px solid #EDE8E2',
                  borderRadius: '100px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                삭제
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#5C5C5C' }}>정말 삭제할까요?</span>
                <button
                  onClick={handleDelete}
                  style={{
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#fff',
                    backgroundColor: '#C1714F',
                    border: 'none',
                    borderRadius: '100px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  확인
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  style={{
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#8C8070',
                    backgroundColor: '#FAF8F5',
                    border: '1.5px solid #EDE8E2',
                    borderRadius: '100px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  취소
                </button>
              </div>
            )}
          </div>
        )}

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

      {/* 수정 모달 */}
      {canEdit && (
        <CurationFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          initialData={editData}
        />
      )}
    </>
  )
}
