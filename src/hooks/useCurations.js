/**
 * useCurations.js
 * 큐레이션 목록 및 상세 정보를 가져오는 훅
 */

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { CURATIONS, getCurationPlaces } from '../data/sampleData'

// 큐레이션 목록
export function useCurations({ limit = 10 } = {}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      setLoading(true)
      try {
        if (supabase) {
          const { data: rows, error: err } = await supabase
            .from('curations')
            .select('*')
            .eq('is_published', true)
            .order('display_order')
            .limit(limit)
          if (err) throw err
          if (!cancelled) setData(rows)
        } else {
          if (!cancelled) setData(CURATIONS.slice(0, limit))
        }
      } catch (err) {
        if (!cancelled) setError(err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [limit])

  return { data, loading, error }
}

// 특정 큐레이션 상세 (slug로 조회)
export function useCurationDetail(slug) {
  const [curation, setCuration] = useState(null)
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
          const found = CURATIONS.find(c => c.slug === slug)
          if (!found) throw new Error('큐레이션을 찾을 수 없습니다.')
          if (!cancelled) {
            setCuration(found)
            setPlaces(getCurationPlaces(found))
          }
        }
      } catch (err) {
        if (!cancelled) setError(err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetch()
    return () => { cancelled = true }
  }, [slug])

  return { curation, places, loading, error }
}
