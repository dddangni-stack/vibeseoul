/**
 * Footer.jsx
 * 하단 푸터 컴포넌트
 * 브랜드 설명, 네비게이션 링크, 저작권 정보를 표시합니다.
 */

import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: 'auto',
        backgroundColor: '#2C2C2C',
        color: '#B5ADA3',
        padding: '48px 20px 32px',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px',
            marginBottom: '40px',
          }}
        >
          {/* 브랜드 소개 */}
          <div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#FAF8F5', marginBottom: '12px' }}>
              <span style={{ color: '#C1714F' }}>●</span> Vibe Seoul
            </div>
            <p style={{ fontSize: '13px', lineHeight: '1.7', color: '#8C8070' }}>
              분위기로 찾는 서울의 카페 & 맛집.<br />
              별점보다 감성, 위치보다 경험.
            </p>
          </div>

          {/* 메뉴 */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#FAF8F5', marginBottom: '16px', letterSpacing: '1px', textTransform: 'uppercase' }}>
              탐색
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <FooterLink to="/places">전체 장소</FooterLink>
              <FooterLink to="/tags">태그 찾기</FooterLink>
              <FooterLink to="/curations">큐레이션</FooterLink>
            </nav>
          </div>

          {/* 계정 */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#FAF8F5', marginBottom: '16px', letterSpacing: '1px', textTransform: 'uppercase' }}>
              계정
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <FooterLink to="/login">로그인</FooterLink>
              <FooterLink to="/bookmarks">저장한 장소</FooterLink>
            </nav>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid #3C3C3C',
            paddingTop: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <span style={{ fontSize: '12px', color: '#5C5C5C' }}>
            © 2025 Vibe Seoul. 포트폴리오 프로젝트.
          </span>
          <span style={{ fontSize: '12px', color: '#5C5C5C' }}>
            React + Supabase
          </span>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      style={{
        fontSize: '13px',
        color: '#8C8070',
        textDecoration: 'none',
        transition: 'color 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.color = '#FAF8F5' }}
      onMouseLeave={e => { e.currentTarget.style.color = '#8C8070' }}
    >
      {children}
    </Link>
  )
}
