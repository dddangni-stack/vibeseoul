/**
 * PlaceListPage.jsx
 * 장소 목록 페이지
 *
 * - URL searchParams로 필터 상태 관리 (공유 가능한 URL)
 * - 태그 필터, 검색어, 정렬 옵션 지원
 * - ?tag=date&sort=popular 형태로 URL 구성
 * - 플로팅 "장소 추가" 버튼 + PlaceFormModal 연동
 */

import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import PlaceGrid from '../components/place/PlaceGrid'
import PlaceFormModal from '../components/place/PlaceFormModal'
import Tag from '../components/common/Tag'
import { usePlaces } from '../hooks/usePlaces'
import { useSearch } from '../hooks/useSearch'
import { TAGS } from '../lib/tags'
import { SORT_OPTIONS } from '../lib/constants'

export default function PlaceListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTag = searchParams.get('tag') || ''
  const sortParam = searchParams.get('sort') || 'latest'

  const [searchQuery, setSearchQuery, debouncedSearch] = useSearch(searchParams.get('q') || '')

  // 모달 상태
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)

  function openAdd() {
    setEditTarget(null)
    setModalOpen(true)
  }

  function openEdit(place) {
    setEditTarget(place)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditTarget(null)
  }

  // 필터 파라미터 업데이트 헬퍼
  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  const { data: places, loading } = usePlaces({
    tags: activeTag ? [activeTag] : [],
    search: debouncedSearch,
    sort: sortParam,
    limit: 30,
  })

  const activeTagObj = TAGS.find(t => t.slug === activeTag)
  const moodTags = TAGS.filter(t => t.type === 'mood')
  const situationTags = TAGS.filter(t => t.type === 'situation')
  const otherTags = TAGS.filter(t => t.type === 'other')

  return (
    <PageWrapper>
      {/* 페이지 헤더 */}
      <div style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontSize: 'clamp(22px, 4vw, 30px)',
            fontWeight: 800,
            color: '#2C2C2C',
            letterSpacing: '-0.5px',
            marginBottom: '8px',
          }}
        >
          장소 탐색
        </h1>
        <p style={{ fontSize: '14px', color: '#8C8070' }}>
          서울의 감성 카페·맛집을 분위기와 상황으로 찾아보세요
        </p>
      </div>

      {/* 검색 바 */}
      <div style={{ position: 'relative', marginBottom: '24px' }}>
        <div
          style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#B5ADA3',
            pointerEvents: 'none',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={e => {
            setSearchQuery(e.target.value)
            updateParam('q', e.target.value)
          }}
          placeholder="장소명, 지역명으로 검색..."
          style={{
            width: '100%',
            padding: '13px 16px 13px 44px',
            fontSize: '14px',
            color: '#2C2C2C',
            backgroundColor: '#fff',
            border: '1.5px solid #EDE8E2',
            borderRadius: '12px',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.15s',
          }}
          onFocus={e => { e.target.style.borderColor = '#C1714F' }}
          onBlur={e => { e.target.style.borderColor = '#EDE8E2' }}
        />
        {searchQuery && (
          <button
            onClick={() => { setSearchQuery(''); updateParam('q', '') }}
            style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#B5ADA3',
              fontSize: '18px',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        )}
      </div>

      {/* 태그 필터 */}
      <div style={{ marginBottom: '24px' }}>
        <FilterTagGroup
          label="분위기"
          tags={moodTags}
          activeSlug={activeTag}
          onTagClick={(slug) => updateParam('tag', slug === activeTag ? '' : slug)}
        />
        <FilterTagGroup
          label="상황"
          tags={situationTags}
          activeSlug={activeTag}
          onTagClick={(slug) => updateParam('tag', slug === activeTag ? '' : slug)}
        />
        <FilterTagGroup
          label="기타"
          tags={otherTags}
          activeSlug={activeTag}
          onTagClick={(slug) => updateParam('tag', slug === activeTag ? '' : slug)}
        />
      </div>

      {/* 활성 필터 + 정렬 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        {/* 활성 필터 칩 */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {activeTagObj && (
            <button
              onClick={() => updateParam('tag', '')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 600,
                padding: '5px 12px',
                borderRadius: '100px',
                border: 'none',
                backgroundColor: '#2C2C2C',
                color: '#FAF8F5',
                cursor: 'pointer',
              }}
            >
              {activeTagObj.emoji} {activeTagObj.name_ko} ×
            </button>
          )}
          {debouncedSearch && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                fontSize: '12px',
                color: '#8C8070',
              }}
            >
              "{debouncedSearch}" 검색 결과 {places.length}개
            </span>
          )}
        </div>

        {/* 정렬 */}
        <select
          value={sortParam}
          onChange={e => updateParam('sort', e.target.value)}
          style={{
            fontSize: '13px',
            color: '#5C5C5C',
            border: '1px solid #EDE8E2',
            borderRadius: '8px',
            padding: '6px 12px',
            backgroundColor: '#fff',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* 장소 그리드 */}
      <PlaceGrid
        places={places}
        loading={loading}
        showBookmark={true}
        emptyMessage="검색 결과가 없어요"
        emptyDescription="다른 태그나 검색어로 찾아보세요 🔍"
        onEdit={openEdit}
      />

      {/* 플로팅 장소 추가 버튼 */}
      <button
        onClick={openAdd}
        title="장소 추가"
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#2C2C2C',
          color: '#FAF8F5',
          border: 'none',
          cursor: 'pointer',
          fontSize: '26px',
          lineHeight: 1,
          boxShadow: '0 4px 20px rgba(44,44,44,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          transition: 'transform 0.15s, background-color 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
      >
        +
      </button>

      {/* 장소 추가/수정 모달 */}
      <PlaceFormModal
        isOpen={modalOpen}
        onClose={closeModal}
        initialData={editTarget}
      />
    </PageWrapper>
  )
}

// 태그 그룹 필터 컴포넌트
function FilterTagGroup({ label, tags, activeSlug, onTagClick }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <span
        style={{
          fontSize: '11px',
          fontWeight: 600,
          color: '#B5ADA3',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          marginRight: '8px',
        }}
      >
        {label}
      </span>
      <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
        {tags.map(tag => (
          <Tag
            key={tag.id}
            tag={tag}
            active={activeSlug === tag.slug}
            onClick={() => onTagClick(tag.slug)}
            size="sm"
          />
        ))}
      </div>
    </div>
  )
}
