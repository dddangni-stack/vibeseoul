/**
 * NotFoundPage.jsx
 * 404 페이지
 */

import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 60px)',
        padding: '40px 20px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '64px', marginBottom: '20px' }}>🗺️</div>
      <h1
        style={{
          fontSize: '32px',
          fontWeight: 800,
          color: '#2C2C2C',
          marginBottom: '12px',
          letterSpacing: '-0.5px',
        }}
      >
        길을 잃었어요
      </h1>
      <p style={{ fontSize: '15px', color: '#8C8070', marginBottom: '32px', lineHeight: 1.6 }}>
        요청하신 페이지를 찾을 수 없어요.<br />
        주소가 올바른지 확인해보세요.
      </p>
      <Link
        to="/"
        style={{
          backgroundColor: '#2C2C2C',
          color: '#FAF8F5',
          fontWeight: 600,
          fontSize: '14px',
          padding: '12px 28px',
          borderRadius: '100px',
          textDecoration: 'none',
        }}
      >
        홈으로 돌아가기
      </Link>
    </div>
  )
}
