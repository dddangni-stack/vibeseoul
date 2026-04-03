/**
 * Navbar.jsx
 * 잡지 마스트헤드 스타일 네비게이션
 * — 상단 얇은 라벨 바 + 중앙 큰 로고 + 하단 섹션 링크
 */

import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  function isActive(path) {
    return location.pathname === path
  }

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(250, 248, 245, 0.96)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '2px solid #2C2C2C',
      }}
    >
      {/* ── 상단: 잡지 소개 스트립 ── */}
      <div
        style={{
          backgroundColor: '#2C2C2C',
          padding: '5px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: '10px', color: '#B5ADA3', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
          서울 감성 장소 탐색 플랫폼
        </span>
        <span style={{ fontSize: '10px', color: '#8C8070', letterSpacing: '1px' }}>
          ★ 분위기로 찾는 서울의 카페 &amp; 맛집 ★
        </span>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {user ? (
            <button
              onClick={handleSignOut}
              style={{ fontSize: '10px', color: '#B5ADA3', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '1px', fontFamily: 'inherit' }}
            >
              로그아웃
            </button>
          ) : (
            <Link to="/login" style={{ fontSize: '10px', color: '#C1714F', letterSpacing: '1px', textDecoration: 'none', fontWeight: 600 }}>
              로그인
            </Link>
          )}
        </div>
      </div>

      {/* ── 중앙: 마스트헤드 로고 ── */}
      <div
        style={{
          padding: '10px 20px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        {/* 왼쪽 장식 */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ height: '1px', flex: 1, backgroundColor: '#2C2C2C' }} />
          <span style={{ fontSize: '11px', color: '#B5ADA3', whiteSpace: 'nowrap', letterSpacing: '0.5px' }}>
            Vol.2025
          </span>
        </div>

        {/* 로고 */}
        <Link
          to="/"
          style={{
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: 'clamp(28px, 5vw, 44px)',
              fontWeight: 900,
              color: '#2C2C2C',
              letterSpacing: '-2px',
              lineHeight: 1,
              fontStyle: 'italic',
            }}
          >
            VIBE<span style={{ color: '#C1714F' }}>.</span>
          </div>
          <div
            style={{
              fontSize: '9px',
              fontWeight: 700,
              color: '#8C8070',
              letterSpacing: '4px',
              textTransform: 'uppercase',
            }}
          >
            SEOUL
          </div>
        </Link>

        {/* 오른쪽 장식 */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', color: '#B5ADA3', whiteSpace: 'nowrap', letterSpacing: '0.5px' }}>
            {user && <span style={{ color: '#C1714F' }}>● </span>}
            {user ? '로그인 중' : 'Free Issue'}
          </span>
          <div style={{ height: '1px', flex: 1, backgroundColor: '#2C2C2C' }} />
        </div>
      </div>

      {/* ── 하단: 섹션 링크 탭 바 ── */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0',
          borderTop: '1px solid #EDE8E2',
          marginTop: '8px',
          overflowX: 'auto',
        }}
        className="scrollbar-hide"
      >
        {[
          { to: '/', label: 'HOME' },
          { to: '/places', label: '장소 탐색' },
          { to: '/tags', label: '태그 찾기' },
          { to: '/curations', label: '큐레이션' },
          ...(user ? [{ to: '/bookmarks', label: '저장한 곳' }] : []),
        ].map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            style={{
              display: 'block',
              padding: '8px 16px',
              fontSize: '11px',
              fontWeight: isActive(to) ? 800 : 500,
              color: isActive(to) ? '#2C2C2C' : '#8C8070',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderBottom: isActive(to) ? '2px solid #C1714F' : '2px solid transparent',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s',
            }}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
