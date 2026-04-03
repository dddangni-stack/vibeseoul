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
 *   - exclude: string — 제외할 장소 id (상세 페이지의 유사 장소 등)
 *
 * 반환값: { data, loading, error }
 *
 * 로컬 모드에서는 PlaceStoreContext의 allPlaces를 사용하여
 * 사용자 추가 장소 + 기본 장소(숨김 제외)를 모두 포함합니다.
 */

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { filterPlacesByTags, searchPlaces } from '../data/sampleData'
import { usePlaceStore } from '../context/PlaceStoreContext'

export function usePlaces({
  tags = [],
  region = null,
  search = '',
  sort = 'latest',
  limit = 20,
  exclude = null,
} = {}) {
  const { allPlaces } = usePlaceStore()
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
        let result

        if (supabase) {
          // ── Supabase 모드 ──
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
          result = rows
        } else {
          // ── 로컬 모드: PlaceStoreContext의 allPlaces 사용 ──
          let filtered = [...allPlaces]

          if (exclude) filtered = filtered.filter(p => p.id !== exclude)
          if (region) filtered = filtered.filter(p => p.region === region)
          if (search) filtered = searchPlaces(filtered, search)
          if (tags.length > 0) filtered = filterPlacesByTags(filtered, tags)

          if (sort === 'popular') {
            filtered.sort((a, b) => b.bookmark_count - a.bookmark_count)
          } else {
            filtered.reverse()
          }

          result = filtered.slice(0, limit)
        }

        if (!cancelled) setData(result)
      } catch (err) {
        if (!cancelled) setError(err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchPlaces()

    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allPlaces, tagsKey, region, search, sort, limit, exclude])

  return { data, loading, error }
}
