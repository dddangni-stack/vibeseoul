/**
 * BookmarksPage.jsx
 * 북마크(저장한 장소) 페이지
 *
 * - 로그인 사용자 전용 (ProtectedRoute로 보호됨)
 * - 북마크한 장소 목록을 그리드로 표시
 */

import { Link } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import PlaceGrid from '../components/place/PlaceGrid'
import { useBookmarks } from '../hooks/useBookmarks'
import { useAuth } from '../context/AuthContext'

export default function BookmarksPage() {
  const { user } = useAuth()
  const { bookmarkedPlaces, loading } = useBookmarks()

  return (
    <PageWrapper>
      {/* 헤더 */}
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
          저장한 장소
        </h1>
        <p style={{ fontSize: '14px', color: '#8C8070' }}>
          {user?.email && (
            <span style={{ color: '#C1714F', fontWeight: 500 }}>{user.email}</span>
          )}{' '}
          님이 저장한 {bookmarkedPlaces.length}개의 장소
        </p>
      </div>

      {/* 장소 그리드 */}
      <PlaceGrid
        places={bookmarkedPlaces}
        loading={loading}
        showBookmark={true}
        emptyMessage="아직 저장한 장소가 없어요"
        emptyDescription="마음에 드는 장소의 🔖 버튼을 눌러 저장해보세요"
      />

      {/* 빈 상태일 때 탐색 유도 */}
      {!loading && bookmarkedPlaces.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: '8px' }}>
          <Link
            to="/places"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#C1714F',
              color: '#FAF8F5',
              fontWeight: 600,
              fontSize: '14px',
              padding: '11px 24px',
              borderRadius: '100px',
              textDecoration: 'none',
            }}
          >
            장소 탐색하러 가기 →
          </Link>
        </div>
      )}
    </PageWrapper>
  )
}
