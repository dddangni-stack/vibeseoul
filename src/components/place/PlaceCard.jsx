/**
 * PlaceCard.jsx
 * 장소 카드 컴포넌트
 *
 * Props:
 *   - place: 장소 객체
 *   - showBookmark: boolean — 북마크 아이콘 표시 여부
 *   - size: 'default' | 'compact'
 *   - onEdit: (place) => void — 수정 버튼 클릭 시 (사용자 추가 장소만)
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Tag from '../common/Tag'
import Badge from '../common/Badge'
import BookmarkButton from './BookmarkButton'
import { getPlaceTags } from '../../lib/tags'
import { getPlaceImage, FALLBACK_IMAGE } from '../../lib/imageUtils'
import { usePlaceStore } from '../../context/PlaceStoreContext'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

export default function PlaceCard({ place, showBookmark = false, size = 'default', onEdit }) {
  const { deleteCustomPlace, hidePlace, triggerRefresh } = usePlaceStore()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [confirmDelete, setConfirmDelete] = useState(false)

  // Supabase 모드에서는 place_tags 조인 결과를, 로컬 모드에서는 getPlaceTags 사용
  const tags = place.place_tags
    ? place.place_tags.map(pt => pt.tags).filter(Boolean)
    : getPlaceTags(place)

  const coverImage = getPlaceImage(place)

  const isCustom = Boolean(place.isCustom || place.source === 'custom')
  const canEdit = isCustom && Boolean(user && place.user_id === user.id)

  async function handleDelete() {
    if (supabase) {
      // Supabase 모드: custom 장소만 삭제 가능 (RLS가 default 장소 차단)
      await supabase.from('places').delete().eq('id', place.id)
      triggerRefresh()
    } else {
      // 로컬 모드
      if (isCustom) {
        deleteCustomPlace(place.id)
      } else {
        hidePlace(place.id)
      }
    }
    setConfirmDelete(false)
  }

  return (
    <div
      className="card-hover fade-in"
      style={{
        backgroundColor: '#fff',
        borderRadius: '0',
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(44,44,44,0.06)',
        border: `1.5px solid ${isCustom ? '#F0E8E0' : '#EDE8E2'}`,
        position: 'relative',
      }}
    >
      {/* 이미지 */}
      <Link to={`/places/${place.slug}`} style={{ display: 'block' }}>
        <div
          style={{
            position: 'relative',
            paddingTop: size === 'compact' ? '60%' : '66.67%',
            overflow: 'hidden',
            backgroundColor: '#F2EDE6',
          }}
        >
          <img
            src={coverImage}
            alt={place.name}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
            }}
            onError={e => { e.target.src = FALLBACK_IMAGE }}
            onMouseEnter={e => { e.target.style.transform = 'scale(1.04)' }}
            onMouseLeave={e => { e.target.style.transform = 'scale(1)' }}
          />
          {/* 가격대 배지 */}
          {place.price_range && (
            <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
              <Badge variant="price">{place.price_range}</Badge>
            </div>
          )}
        </div>
      </Link>

      {/* 북마크 버튼 */}
      {showBookmark && !isCustom && (
        <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
          <BookmarkButton placeId={place.id} />
        </div>
      )}

      {/* 콘텐츠 */}
      <div style={{ padding: size === 'compact' ? '12px' : '16px' }}>
        {/* 지역 배지 + 내가 추가한 장소 배지 */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <Badge variant="region">{place.region}</Badge>
          {isCustom && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                fontSize: '10px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '100px',
                backgroundColor: '#FFF5F0',
                color: '#C1714F',
                border: '1px solid #F0D8CC',
                letterSpacing: '0.2px',
              }}
            >
              내가 추가한 장소
            </span>
          )}
        </div>

        {/* 장소명 */}
        <Link to={`/places/${place.slug}`} style={{ textDecoration: 'none' }}>
          <h3
            style={{
              fontSize: size === 'compact' ? '14px' : '16px',
              fontWeight: 700,
              color: '#2C2C2C',
              marginBottom: '6px',
              lineHeight: '1.3',
            }}
            className="line-clamp-1"
          >
            {place.name}
          </h3>
        </Link>

        {/* 한 줄 소개 */}
        <p
          style={{
            fontSize: '13px',
            color: '#8C8070',
            marginBottom: '12px',
            lineHeight: '1.5',
          }}
          className="line-clamp-2"
        >
          {place.one_liner}
        </p>

        {/* 태그 */}
        {tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
            {tags.slice(0, 3).map(tag => (
              <Tag key={tag.id || tag.slug} tag={tag} size="sm" />
            ))}
          </div>
        )}

        {/* 액션 버튼 영역 — Supabase 모드에선 소유자만, 로컬 모드에선 모든 장소 */}
        {(canEdit || !supabase) && (
        <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
          {/* 수정 버튼: 소유자만 */}
          {canEdit && onEdit && (
            <button
              onClick={() => onEdit(place)}
              style={{
                flex: 1,
                padding: '7px 0',
                fontSize: '12px',
                fontWeight: 600,
                color: '#5C5C5C',
                backgroundColor: '#FAF8F5',
                border: '1px solid #EDE8E2',
                borderRadius: '8px',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              수정
            </button>
          )}

          {/* 삭제 버튼: 모든 장소 */}
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              style={{
                flex: canEdit && onEdit ? 1 : 'none',
                padding: '7px 12px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#B5ADA3',
                backgroundColor: 'transparent',
                border: '1px solid #EDE8E2',
                borderRadius: '8px',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {canEdit ? '삭제' : '숨기기'}
            </button>
          ) : (
            /* 삭제 확인 인라인 */
            <div
              style={{
                flex: 1,
                display: 'flex',
                gap: '4px',
              }}
            >
              <button
                onClick={handleDelete}
                style={{
                  flex: 1,
                  padding: '7px 0',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#fff',
                  backgroundColor: '#C1714F',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                확인
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                style={{
                  flex: 1,
                  padding: '7px 0',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#8C8070',
                  backgroundColor: '#FAF8F5',
                  border: '1px solid #EDE8E2',
                  borderRadius: '8px',
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
      </div>
    </div>
  )
}
