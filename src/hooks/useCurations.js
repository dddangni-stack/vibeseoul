/**
 * useCurations.js
 * 큐레이션 목록 및 상세 정보를 가져오는 훅
 */

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { usePlaceStore } from '../context/PlaceStoreContext'

// 큐레이션 목록
export function useCurations({ limit = 10 } = {}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { curationRefreshToken } = usePlaceStore()

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      setLoading(true)
      try {
        if (supabase) {
          // is_published 필터 제거 — RLS가 서버에서 소유자/admin 미게시 큐레이션 필터링
          const { data: rows, error: err } = await supabase
            .from('curations')
            .select('*, curation_places(id)')
            .order('display_order')
            .limit(limit)
          if (err) throw err
          if (!cancelled) setData(rows)
        } else {
          if (!cancelled) setData([])
        }
      } catch (err) {
        if (!cancelled) setError(err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [limit, curationRefreshToken])

  return { data, loading, error }
}

// 특정 큐레이션 상세 (slug로 조회)
export function useCurationDetail(slug) {
  const [curation, setCuration] = useState(null)
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { curationRefreshToken } = usePlaceStore()

  useEffect(() => {
    if (!slug) return
    let cancelled = false

    async function fetch() {
      setLoading(true)
      try {
        if (supabase) {
          const { data: cur, error: err } = await supabase
            .from('curations')
            .select(`*, curation_places ( display_order, note, places(*) )`)
            .eq('slug', slug)
            .single()
          if (err) throw err
          if (!cancelled) {
            setCuration(cur)
            setPlaces(
              (cur.curation_places || [])
                .sort((a, b) => a.display_order - b.display_order)
                .map(cp => ({ ...cp.places, _note: cp.note }))
            )
          }
        } else {
          if (!cancelled) setError(new Error('Supabase가 연결되어 있지 않습니다.'))
        }
      } catch (err) {
        if (!cancelled) setError(err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetch()
    return () => { cancelled = true }
  }, [slug, curationRefreshToken])

  return { curation, places, loading, error }
}
