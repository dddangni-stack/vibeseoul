/**
 * LoginPage.jsx
 * 로그인 페이지
 *
 * - 이미 로그인된 경우 ?redirect 또는 홈으로 이동
 * - 로그인 성공 후 redirect
 */

import { useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import LoginForm from '../components/auth/LoginForm'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  // 이미 로그인된 경우 리다이렉트
  useEffect(() => {
    if (user) navigate(redirect, { replace: true })
  }, [user, navigate, redirect])

  function handleLoginSuccess() {
    navigate(redirect, { replace: true })
  }

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 60px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* 로고 */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div
              style={{
                fontSize: '22px',
                fontWeight: 800,
                color: '#2C2C2C',
                letterSpacing: '-0.5px',
                marginBottom: '12px',
              }}
            >
              <span style={{ color: '#C1714F' }}>●</span> Vibe Seoul
            </div>
          </Link>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#2C2C2C',
              marginBottom: '8px',
              letterSpacing: '-0.3px',
            }}
          >
            로그인
          </h1>
          <p style={{ fontSize: '14px', color: '#8C8070' }}>
            북마크하고 나만의 장소를 저장하세요
          </p>
        </div>

        {/* 로그인 폼 박스 */}
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 4px 24px rgba(44,44,44,0.08)',
            border: '1px solid #EDE8E2',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <LoginForm onSuccess={handleLoginSuccess} />
        </div>

        {/* 탐색 유도 */}
        <p style={{ textAlign: 'center', fontSize: '13px', color: '#8C8070', marginTop: '20px' }}>
          로그인 없이도{' '}
          <Link
            to="/places"
            style={{ color: '#C1714F', fontWeight: 600, textDecoration: 'none' }}
          >
            장소를 탐색
          </Link>
          할 수 있어요
        </p>
      </div>
    </div>
  )
}
