/**
 * BookmarkButton.jsx
 * 장소 북마크 버튼
 *
 * - 로그인 사용자: 즉시 토글 (낙관적 업데이트)
 * - 미로그인: /login으로 이동
 *
 * Props:
 *   - placeId: string
 *   - size: 'sm' | 'md'
 *   - variant: 'floating' | 'inline' — floating은 반투명 배경 원형
 */

import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useBookmarks } from '../../hooks/useBookmarks'

export default function BookmarkButton({ placeId, size = 'md', variant = 'floating' }) {
  const { user } = useAuth()
  const { isBookmarked, toggleBookmark } = useBookmarks()
  const navigate = useNavigate()

  const bookmarked = isBookmarked(placeId)

  async function handleClick(e) {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname))
      return
    }

    await toggleBookmark(placeId)
  }

  const iconSize = size === 'sm' ? 16 : 20

  return (
    <button
      onClick={handleClick}
      title={bookmarked ? '북마크 취소' : '북마크'}
      aria-label={bookmarked ? '북마크 취소' : '북마크 추가'}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size === 'sm' ? '32px' : '40px',
        height: size === 'sm' ? '32px' : '40px',
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        ...(variant === 'floating'
          ? {
              backgroundColor: 'rgba(250, 248, 245, 0.92)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 2px 8px rgba(44,44,44,0.12)',
            }
          : {
              backgroundColor: bookmarked ? '#FDF4E7' : '#F2EDE6',
            }),
      }}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill={bookmarked ? '#C1714F' : 'none'}
        stroke={bookmarked ? '#C1714F' : '#8C8070'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  )
}
