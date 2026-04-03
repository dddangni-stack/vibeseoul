/**
 * TagNavBar.jsx
 * 홈 화면 태그 네비게이션 바
 * 가로 스크롤 가능한 태그 버튼 목록
 *
 * Props:
 *   - tags: Tag[]
 *   - activeSlug: string | null
 *   - onTagClick: (slug: string) => void
 */

import Tag from '../common/Tag'

export default function TagNavBar({ tags = [], activeSlug = null, onTagClick }) {
  return (
    <div
      className="scrollbar-hide"
      style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '4px',
        paddingTop: '2px',
      }}
    >
      {/* 전체 보기 버튼 */}
      <button
        onClick={() => onTagClick(null)}
        style={{
          flexShrink: 0,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '12px',
          fontWeight: activeSlug === null ? 700 : 500,
          padding: '5px 14px',
          borderRadius: '100px',
          border: '1px solid',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          transition: 'all 0.15s ease',
          backgroundColor: activeSlug === null ? '#2C2C2C' : '#FAF8F5',
          color: activeSlug === null ? '#FAF8F5' : '#5C5C5C',
          borderColor: activeSlug === null ? '#2C2C2C' : '#EDE8E2',
        }}
      >
        🗺️ 전체
      </button>

      {/* 태그 버튼들 */}
      {tags.map(tag => (
        <div key={tag.id} style={{ flexShrink: 0 }}>
          <Tag
            tag={tag}
            active={activeSlug === tag.slug}
            onClick={() => onTagClick(activeSlug === tag.slug ? null : tag.slug)}
          />
        </div>
      ))}
    </div>
  )
}
