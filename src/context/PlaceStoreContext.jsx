/**
 * PlaceStoreContext.jsx
 * 장소 관리 전역 상태 (localStorage 기반)
 *
 * 제공 값:
 *   allPlaces      — 기본 장소 + 사용자 추가 장소 (숨김 제외)
 *   customPlaces   — 사용자가 추가한 장소 배열
 *   hiddenIds      — 기본 장소 중 숨긴 id 배열 (soft delete)
 *   addPlace(data)               — 사용자 장소 추가
 *   updatePlace(id, data)        — 사용자 장소 수정
 *   deleteCustomPlace(id)        — 사용자 장소 삭제 (hard delete)
 *   hidePlace(id)                — 기본 장소 숨김 (soft delete)
 *   restorePlace(id)             — 숨긴 기본 장소 복구
 */

import { createContext, useContext, useState, useMemo, useCallback } from 'react'
import { PLACES } from '../data/sampleData'

const LS_CUSTOM = 'vibe_custom_places'
const LS_HIDDEN = 'vibe_hidden_place_ids'

function readLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const PlaceStoreContext = createContext(null)

export function PlaceStoreProvider({ children }) {
  const [customPlaces, setCustomPlaces] = useState(() => readLS(LS_CUSTOM, []))
  const [hiddenIds, setHiddenIds] = useState(() => readLS(LS_HIDDEN, []))

  // 최종 목록: 기본 장소(숨김 제외) + 사용자 추가 장소
  const allPlaces = useMemo(
    () => [
      ...PLACES.filter(p => !hiddenIds.includes(p.id)),
      ...customPlaces,
    ],
    [hiddenIds, customPlaces]
  )

  // 사용자 장소 추가
  const addPlace = useCallback((formData) => {
    const ts = Date.now()
    const rand = Math.random().toString(36).substr(2, 5)
    const id = `custom-${ts}-${rand}`
    const slug = `custom-${ts}`

    const newPlace = {
      ...formData,
      id,
      slug,
      isCustom: true,
      source: 'custom',
      bookmark_count: 0,
      view_count: 0,
      created_at: new Date().toISOString(),
    }

    setCustomPlaces(prev => {
      const next = [...prev, newPlace]
      localStorage.setItem(LS_CUSTOM, JSON.stringify(next))
      return next
    })

    return newPlace
  }, [])

  // 사용자 장소 수정
  const updatePlace = useCallback((id, formData) => {
    setCustomPlaces(prev => {
      const next = prev.map(p => (p.id === id ? { ...p, ...formData } : p))
      localStorage.setItem(LS_CUSTOM, JSON.stringify(next))
      return next
    })
  }, [])

  // 사용자 장소 삭제 (hard delete)
  const deleteCustomPlace = useCallback((id) => {
    setCustomPlaces(prev => {
      const next = prev.filter(p => p.id !== id)
      localStorage.setItem(LS_CUSTOM, JSON.stringify(next))
      return next
    })
  }, [])

  // 기본 장소 숨김 (soft delete)
  const hidePlace = useCallback((id) => {
    setHiddenIds(prev => {
      if (prev.includes(id)) return prev
      const next = [...prev, id]
      localStorage.setItem(LS_HIDDEN, JSON.stringify(next))
      return next
    })
  }, [])

  // 숨긴 기본 장소 복구
  const restorePlace = useCallback((id) => {
    setHiddenIds(prev => {
      const next = prev.filter(hid => hid !== id)
      localStorage.setItem(LS_HIDDEN, JSON.stringify(next))
      return next
    })
  }, [])

  return (
    <PlaceStoreContext.Provider
      value={{
        allPlaces,
        customPlaces,
        hiddenIds,
        addPlace,
        updatePlace,
        deleteCustomPlace,
        hidePlace,
        restorePlace,
      }}
    >
      {children}
    </PlaceStoreContext.Provider>
  )
}

export function usePlaceStore() {
  const ctx = useContext(PlaceStoreContext)
  if (!ctx) throw new Error('usePlaceStore must be used within PlaceStoreProvider')
  return ctx
}
