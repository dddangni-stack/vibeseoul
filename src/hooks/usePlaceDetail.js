/**
 * usePlaceDetail.js
 * 특정 장소의 상세 정보를 가져오는 훅
 *
 * - slug로 장소를 찾습니다.
 * - 조회수를 1 증가시킵니다 (Supabase 모드에서만).
 * - Supabase 미연결 시 빈 상태를 반환합니다.
 * - 반환값: { place, loading, error }
 */

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { usePlaceStore } from '../context/PlaceStoreContext'

export function usePlaceDetail(slug) {
  const { refreshToken } = usePlaceStore()
  const [place, setPlace] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return
    let cancelled = false

    async function fetchDetail() {
      setLoading(true)
      setError(null)

      try {
        if (!supabase) {
          if (!cancelled) {
            setPlace(null)
            setError(new Error('Supabase가 연결되어 있지 않습니다.'))
          }
          return
        }

        const { data, error: err } = await supabase
          .from('places')
          .select(`
            *,
            place_tags ( tags ( id, slug, name_ko, type, emoji ) ),
            place_images ( image_url, display_order, alt_text )
          `)
          .eq('slug', slug)
          .eq('is_published', true)
          .single()

        if (err) throw err

        // 조회수 증가 (fire-and-forget)
        supabase.rpc('increment_view_count', { place_id: data.id }).then(() => {})

        if (!cancelled) setPlace(data)
      } catch (err) {
        if (!cancelled) setError(err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchDetail()
    return () => { cancelled = true }
  }, [slug, refreshToken])

  return { place, loading, error }
}
