/**
 * PlaceStoreContext.jsx
 * 장소 관리 전역 상태
 *
 * Supabase 모드: 모든 CRUD가 Supabase를 통해 이루어집니다.
 *   allPlaces, customPlaces, hiddenIds, addPlace 등은 사용되지 않습니다.
 *
 * 로컬 모드 (Supabase 미연결): 빈 목록으로 동작합니다.
 *
 * 제공 값:
 *   refreshToken   — usePlaces/usePlaceDetail 재조회 트리거
 *   triggerRefresh — refreshToken을 증가시켜 목록 갱신
 *   (하위 호환용) allPlaces, customPlaces, hiddenIds, addPlace 등
 */

import { createContext, useContext, useState, useCallback } from 'react'

const PlaceStoreContext = createContext(null)

export function PlaceStoreProvider({ children }) {
  // Supabase INSERT/UPDATE/DELETE 후 usePlaces/usePlaceDetail 재조회 트리거
  const [refreshToken, setRefreshToken] = useState(0)
  const triggerRefresh = useCallback(() => setRefreshToken(t => t + 1), [])

  // 큐레이션 INSERT/UPDATE/DELETE 후 재조회 트리거
  const [curationRefreshToken, setCurationRefreshToken] = useState(0)
  const triggerCurationRefresh = useCallback(() => setCurationRefreshToken(t => t + 1), [])

  return (
    <PlaceStoreContext.Provider value={{ refreshToken, triggerRefresh, curationRefreshToken, triggerCurationRefresh }}>
      {children}
    </PlaceStoreContext.Provider>
  )
}

export function usePlaceStore() {
  const ctx = useContext(PlaceStoreContext)
  if (!ctx) throw new Error('usePlaceStore must be used within PlaceStoreProvider')
  return ctx
}
