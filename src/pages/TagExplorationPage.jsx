/**
 * TagExplorationPage.jsx
 * 태그 탐색 페이지
 *
 * - 분위기 태그 / 상황 태그를 카드 그리드로 표시
 * - 각 태그 카드 클릭 시 /places?tag={slug}로 이동
 */

import { useNavigate } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import { TAGS } from '../data/sampleData'
import { getTagColor } from '../utils/tagColors'

export default function TagExplorationPage() {
  const navigate = useNavigate()

  const moodTags = TAGS.filter(t => t.type === 'mood')
  const situationTags = TAGS.filter(t => t.type === 'situation')
  const otherTags = TAGS.filter(t => t.type === 'other')

  return (
    <PageWrapper>
      {/* 헤더 */}
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1
          style={{
            fontSize: 'clamp(24px, 4vw, 32px)',
            fontWeight: 800,
            color: '#2C2C2C',
            letterSpacing: '-0.5px',
            marginBottom: '12px',
          }}
        >
          어떤 공간이 필요하세요?
        </h1>
        <p style={{ fontSize: '15px', color: '#8C8070', lineHeight: 1.6 }}>
          태그를 선택하면 분위기와 상황에 맞는 장소를 찾아드려요
        </p>
      </div>

      {/* 분위기 태그 */}
      <TagSection
        title="🌿 분위기로 찾기"
        subtitle="공간의 분위기와 무드로 선택하세요"
        tags={moodTags}
        onTagClick={(slug) => navigate(`/places?tag=${slug}`)}
      />

      {/* 상황 태그 */}
      <TagSection
        title="💑 상황으로 찾기"
        subtitle="어떤 상황인지 선택하면 딱 맞는 장소를 추천해드려요"
        tags={situationTags}
        onTagClick={(slug) => navigate(`/places?tag=${slug}`)}
      />

      {/* 기타 태그 */}
      <TagSection
        title="⭐ 더 찾아보기"
        subtitle="가성비, 디저트, 늦게까지 운영 등"
        tags={otherTags}
        onTagClick={(slug) => navigate(`/places?tag=${slug}`)}
      />
    </PageWrapper>
  )
}

function TagSection({ title, subtitle, tags, onTagClick }) {
  return (
    <section style={{ marginBottom: '48px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#2C2C2C', marginBottom: '6px' }}>
          {title}
        </h2>
        <p style={{ fontSize: '13px', color: '#8C8070' }}>{subtitle}</p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '12px',
        }}
      >
        {tags.map(tag => (
          <TagCard key={tag.id} tag={tag} onClick={() => onTagClick(tag.slug)} />
        ))}
      </div>
    </section>
  )
}

function TagCard({ tag, onClick }) {
  const colors = getTagColor(tag.slug)

  return (
    <button
      onClick={onClick}
      className="card-hover"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: '24px 16px',
        borderRadius: '16px',
        border: `1.5px solid ${colors.border}`,
        backgroundColor: colors.bg,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontFamily: 'inherit',
        textAlign: 'center',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = '#2C2C2C'
        e.currentTarget.style.borderColor = '#2C2C2C'
        e.currentTarget.style.color = '#FAF8F5'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = colors.bg
        e.currentTarget.style.borderColor = colors.border
        e.currentTarget.style.color = colors.text
      }}
    >
      <span style={{ fontSize: '28px' }}>{tag.emoji}</span>
      <span
        style={{
          fontSize: '13px',
          fontWeight: 700,
          color: colors.text,
          transition: 'color 0.2s',
        }}
      >
        {tag.name_ko}
      </span>
    </button>
  )
}
