/**
 * ProtectedRoute.jsx
 * 로그인이 필요한 페이지를 보호하는 컴포넌트
 *
 * - 미로그인 상태: /login 페이지로 리다이렉트 (현재 경로를 ?redirect=로 전달)
 * - 로딩 중: 스피너 표시
 * - 로그인 상태: children 렌더링
 */

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
        <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
      </div>
    )
  }

  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
  }

  return children
}
