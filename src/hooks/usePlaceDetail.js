/**
 * usePlaceDetail.js
 * 특정 장소의 상세 정보를 가져오는 훅
 *
 * - slug로 장소를 찾습니다.
 * - 로컬 모드에서는 PlaceStoreContext의 allPlaces를 사용합니다.
 *   (사용자 추가 장소 + 기본 장소 포함, 숨김 장소 제외)
 * - 조회수를 1 증가시킵니다 (Supabase 모드에서만).
 * - 반환값: { place, loading, error }
 */

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { usePlaceStore } from '../context/PlaceStoreContext'

export function usePlaceDetail(slug) {
  const { allPlaces } = usePlaceStore()
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
        let result

        if (supabase) {
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
          result = data

          // 조회수 증가 (fire-and-forget)
          supabase.rpc('increment_view_count', { place_id: data.id }).then(() => {})
        } else {
          // 로컬 모드: allPlaces에서 slug로 검색
          result = allPlaces.find(p => p.slug === slug) || null
          if (!result) throw new Error('장소를 찾을 수 없습니다.')
        }

        if (!cancelled) setPlace(result)
      } catch (err) {
        if (!cancelled) setError(err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchDetail()
    return () => { cancelled = true }
  }, [slug, allPlaces])

  return { place, loading, error }
}
