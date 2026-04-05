/**
 * PlaceDetailPage.jsx
 * 장소 상세 페이지
 *
 * 구성:
 * - 사진 갤러리
 * - 장소명 / 지역 / 태그 / 가격대
 * - 한 줄 소개
 * - 분위기 설명
 * - 추천 상황
 * - 상세 후기
 * - 유사 장소 추천
 * - 북마크 버튼 (우측 고정)
 * - [사용자 추가 장소] 수정/삭제 버튼
 * - [기본 장소] 숨기기 버튼
 */

import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PhotoGallery from '../components/place/PhotoGallery'
import SimilarPlaces from '../components/place/SimilarPlaces'
import BookmarkButton from '../components/place/BookmarkButton'
import PlaceFormModal from '../components/place/PlaceFormModal'
import Tag from '../components/common/Tag'
import Badge from '../components/common/Badge'
import Spinner from '../components/common/Spinner'
import PageWrapper from '../components/layout/PageWrapper'
import { usePlaceDetail } from '../hooks/usePlaceDetail'
import { usePlaceStore } from '../context/PlaceStoreContext'
import { useAuth } from '../context/AuthContext'
import { getPlaceTags } from '../lib/tags'
import { getCategoryLabel, getPriceDescription } from '../utils/formatters'
import { supabase } from '../lib/supabase'

export default function PlaceDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { place, loading, error } = usePlaceDetail(slug)
  const { deleteCustomPlace, hidePlace, triggerRefresh } = usePlaceStore()
  const { user } = useAuth()

  const [modalOpen, setModalOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (loading) return <Spinner />
  if (error || !place) {
    return (
      <PageWrapper>
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>😢</div>
          <p style={{ fontSize: '16px', fontWeight: 600, color: '#2C2C2C', marginBottom: '8px' }}>
            장소를 찾을 수 없어요
          </p>
          <p style={{ fontSize: '14px', color: '#8C8070', marginBottom: '24px' }}>
            삭제되었거나 잘못된 주소일 수 있습니다
          </p>
          <button
            onClick={() => navigate('/places')}
            style={{
              backgroundColor: '#2C2C2C',
              color: '#FAF8F5',
              border: 'none',
              padding: '10px 24px',
              borderRadius: '100px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            장소 목록으로
          </button>
        </div>
      </PageWrapper>
    )
  }

  const isCustom = Boolean(place.isCustom || place.source === 'custom')
  const canEdit = isCustom && Boolean(user && place.user_id === user.id)

  // 태그 데이터 정리 (Supabase 모드 / 로컬 모드 모두 지원)
  const tags = place.place_tags
    ? place.place_tags.map(pt => pt.tags).filter(Boolean)
    : getPlaceTags(place)

  const tagSlugs = tags.map(t => t.slug)

  // 이미지 배열 정리
  const images = place.images || place.place_images || []

  async function handleDelete() {
    if (supabase) {
      await supabase.from('places').delete().eq('id', place.id)
      triggerRefresh()
    } else {
      if (isCustom) {
        deleteCustomPlace(place.id)
      } else {
        hidePlace(place.id)
      }
    }
    navigate('/places')
  }

  return (
    <PageWrapper>
      {/* 뒤로가기 */}
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '13px',
          color: '#8C8070',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0 0 20px 0',
          fontFamily: 'inherit',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        뒤로가기
      </button>

      {/* 사진 갤러리 */}
      <PhotoGallery images={images} placeName={place.name} />

      {/* 콘텐츠 레이아웃: 메인 + 사이드바 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) auto',
          gap: '32px',
          marginTop: '28px',
          alignItems: 'start',
        }}
      >
        {/* 메인 콘텐츠 */}
        <div>
          {/* 지역 + 카테고리 배지 + 내가 추가한 장소 배지 */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Badge variant="region">{place.region}</Badge>
            <Badge variant="category">{getCategoryLabel(place.category)}</Badge>
            {place.price_range && (
              <Badge variant="price">
                {place.price_range} · {getPriceDescription(place.price_range)}
              </Badge>
            )}
            {isCustom && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '100px',
                  backgroundColor: '#FFF5F0',
                  color: '#C1714F',
                  border: '1px solid #F0D8CC',
                }}
              >
                내가 추가한 장소
              </span>
            )}
          </div>

          {/* 장소명 */}
          <h1
            style={{
              fontSize: 'clamp(24px, 4vw, 32px)',
              fontWeight: 800,
              color: '#2C2C2C',
              letterSpacing: '-0.5px',
              marginBottom: '8px',
              lineHeight: 1.2,
            }}
          >
            {place.name}
          </h1>

          {/* 한 줄 소개 */}
          <p
            style={{
              fontSize: '16px',
              color: '#8C8070',
              marginBottom: '16px',
              lineHeight: 1.5,
              fontStyle: 'italic',
            }}
          >
            {place.one_liner}
          </p>

          {/* 태그 */}
          {tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
              {tags.map(tag => (
                <Tag key={tag.id || tag.slug} tag={tag} />
              ))}
            </div>
          )}

          {/* 영업 시간 */}
          {place.hours && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                color: '#5C5C5C',
                marginBottom: '28px',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              {place.hours}
            </div>
          )}

          {/* 수정 / 삭제 버튼 영역 — Supabase 모드에선 소유자만 표시 */}
          {(canEdit || !supabase) && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
            {/* 수정: 소유자만 */}
            {canEdit && (
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
            )}

            {/* 삭제 / 숨기기 */}
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
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6M14 11v6" />
                </svg>
                {canEdit ? '삭제' : '목록에서 숨기기'}
              </button>
            ) : (
              /* 삭제 확인 */
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#5C5C5C' }}>
                  {canEdit ? '정말 삭제할까요?' : '목록에서 숨길까요?'}
                </span>
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

          <hr style={{ border: 'none', borderTop: '1px solid #EDE8E2', marginBottom: '28px' }} />

          {/* 분위기 설명 */}
          {place.atmosphere_desc && (
            <Section title="✨ 이런 분위기예요" content={place.atmosphere_desc} />
          )}

          {/* 추천 상황 */}
          {place.recommended_situations?.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h2
                style={{
                  fontSize: '17px',
                  fontWeight: 700,
                  color: '#2C2C2C',
                  marginBottom: '14px',
                }}
              >
                🌿 이런 분들께 추천해요
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {place.recommended_situations.map((s, i) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      gap: '10px',
                      fontSize: '14px',
                      color: '#5C5C5C',
                      lineHeight: 1.6,
                      marginBottom: '10px',
                      padding: '12px 16px',
                      backgroundColor: '#FAF8F5',
                      borderRadius: '10px',
                      border: '1px solid #EDE8E2',
                    }}
                  >
                    <span style={{ color: '#C1714F', flexShrink: 0 }}>●</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 상세 후기 */}
          {place.detailed_review && (
            <Section title="📝 에디터 후기" content={place.detailed_review} />
          )}
        </div>

        {/* 사이드바: 북마크 버튼 (sticky) */}
        <div style={{ position: 'sticky', top: '80px' }}>
          {!isCustom && <BookmarkButton placeId={place.id} size="md" variant="inline" />}
        </div>
      </div>

      {/* 유사 장소 */}
      <SimilarPlaces currentPlaceId={place.id} tagSlugs={tagSlugs} />

      {/* 수정 모달 (소유자만) */}
      {canEdit && (
        <PlaceFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          initialData={place}
        />
      )}
    </PageWrapper>
  )
}

// 섹션 컴포넌트 (재사용)
function Section({ title, content }) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <h2
        style={{
          fontSize: '17px',
          fontWeight: 700,
          color: '#2C2C2C',
          marginBottom: '12px',
        }}
      >
        {title}
      </h2>
      <p style={{ fontSize: '15px', color: '#5C5C5C', lineHeight: 1.8 }}>
        {content}
      </p>
    </div>
  )
}
