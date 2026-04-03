/**
 * SectionHeader.jsx
 * 섹션 제목 + 선택적 "더보기" 링크
 *
 * Props:
 *   - title: string
 *   - subtitle: string (선택)
 *   - linkTo: string (선택 - 더보기 링크)
 *   - linkLabel: string (기본: '더보기')
 */

import { Link } from 'react-router-dom'

export default function SectionHeader({ title, subtitle, linkTo, linkLabel = '더보기' }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: '20px',
        gap: '12px',
      }}
    >
      <div>
        <h2
          style={{
            fontSize: 'clamp(18px, 3vw, 22px)',
            fontWeight: 800,
            color: '#2C2C2C',
            letterSpacing: '-0.3px',
            marginBottom: subtitle ? '4px' : 0,
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p style={{ fontSize: '13px', color: '#8C8070' }}>{subtitle}</p>
        )}
      </div>

      {linkTo && (
        <Link
          to={linkTo}
          style={{
            fontSize: '13px',
            fontWeight: 500,
            color: '#C1714F',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {linkLabel}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  )
}
