/**
 * usePlaces.js
 * 장소 목록을 가져오는 커스텀 훅
 *
 * 파라미터:
 *   - tags: string[] — 태그 slug 배열로 필터링
 *   - region: string — 지역 필터
 *   - search: string — 이름/지역/한줄소개 검색
 *   - sort: 'latest' | 'popular' — 정렬 기준
 *   - limit: number — 최대 개수
 *   - exclude: string — 제외할 장소 id
 *
 * 반환값: { data, loading, error }
 *
 * Supabase 미연결 시 빈 목록을 반환합니다.
 */

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { usePlaceStore } from '../context/PlaceStoreContext'

export function usePlaces({
  tags = [],
  region = null,
  search = '',
  sort = 'latest',
  limit = 20,
  exclude = null,
} = {}) {
  const { refreshToken } = usePlaceStore()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const tagsKey = tags.join(',')

  useEffect(() => {
    let cancelled = false

    async function fetchPlaces() {
      setLoading(true)
      setError(null)

      try {
        if (!supabase) {
          // Supabase 미연결: 빈 목록
          if (!cancelled) setData([])
          return
        }

        let query = supabase
          .from('places')
          .select(`
            *,
            place_tags ( tags ( id, slug, name_ko, type, emoji ) ),
            place_images ( image_url, display_order, alt_text )
          `)
          .eq('is_published', true)

        if (region) query = query.eq('region', region)
        if (search) query = query.ilike('name', `%${search}%`)
        if (exclude) query = query.neq('id', exclude)
        if (sort === 'popular') query = query.order('bookmark_count', { ascending: false })
        else query = query.order('created_at', { ascending: false })
        query = query.limit(limit)

        const { data: rows, error: err } = await query
        if (err) throw err
        if (!cancelled) setData(rows)
      } catch (err) {
        if (!cancelled) setError(err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchPlaces()

    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagsKey, region, search, sort, limit, exclude, refreshToken])

  return { data, loading, error }
}
