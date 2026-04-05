/**
 * useBookmarks.js
 * 북마크 상태 관리 훅
 *
 * - 로그인한 사용자의 북마크 목록을 관리합니다.
 * - toggleBookmark: 낙관적 업데이트 (즉시 UI 반영 후 서버 동기화)
 * - 로컬 모드: localStorage로 북마크 저장
 */

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useBookmarks() {
  const { user } = useAuth()
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set())
  const [bookmarkedPlaces, setBookmarkedPlaces] = useState([])
  const [loading, setLoading] = useState(false)

  // 북마크 목록 로드
  useEffect(() => {
    if (!user) {
      setBookmarkedIds(new Set())
      setBookmarkedPlaces([])
      return
    }

    async function loadBookmarks() {
      setLoading(true)
      try {
        if (supabase) {
          const { data, error } = await supabase
            .from('bookmarks')
            .select('place_id, places(*)')
            .eq('user_id', user.id)

          if (error) throw error
          const ids = new Set(data.map(b => b.place_id))
          setBookmarkedIds(ids)
          setBookmarkedPlaces(data.map(b => b.places).filter(Boolean))
        } else {
          // 로컬 모드: localStorage에서 복원
          const stored = localStorage.getItem('vibe_seoul_bookmarks')
          const ids = stored ? JSON.parse(stored) : []
          setBookmarkedIds(new Set(ids))
          setBookmarkedPlaces([])
        }
      } finally {
        setLoading(false)
      }
    }

    loadBookmarks()
  }, [user])

  // 북마크 토글 (낙관적 업데이트)
  const toggleBookmark = useCallback(async (placeId) => {
    if (!user) return false

    const isBookmarked = bookmarkedIds.has(placeId)
    const newIds = new Set(bookmarkedIds)

    // 1. 즉시 로컬 상태 반전 (낙관적 업데이트)
    if (isBookmarked) {
      newIds.delete(placeId)
    } else {
      newIds.add(placeId)
    }
    setBookmarkedIds(newIds)
    setBookmarkedPlaces([])

    // 2. 서버 동기화
    try {
      if (supabase) {
        if (isBookmarked) {
          const { error } = await supabase
            .from('bookmarks')
            .delete()
            .eq('user_id', user.id)
            .eq('place_id', placeId)
          if (error) throw error
        } else {
          const { error } = await supabase
            .from('bookmarks')
            .insert({ user_id: user.id, place_id: placeId })
          if (error) throw error
        }
      } else {
        // 로컬 모드: localStorage 저장
        const ids = Array.from(newIds)
        localStorage.setItem('vibe_seoul_bookmarks', JSON.stringify(ids))
      }
      return true
    } catch {
      // 3. 실패 시 롤백
      setBookmarkedIds(bookmarkedIds)
      setBookmarkedPlaces([])
      return false
    }
  }, [user, bookmarkedIds])

  const isBookmarked = useCallback(
    (placeId) => bookmarkedIds.has(placeId),
    [bookmarkedIds]
  )

  return { bookmarkedIds, bookmarkedPlaces, loading, toggleBookmark, isBookmarked }
}
