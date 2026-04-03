/**
 * useSearch.js
 * 검색어 디바운싱 훅
 *
 * 입력값을 즉시 표시하되, 실제 검색은 350ms 지연 후 실행합니다.
 * 외부 라이브러리 없이 setTimeout/clearTimeout으로 구현합니다.
 *
 * 사용법:
 *   const [query, setQuery, debouncedQuery] = useSearch('')
 *   // query → input에 바인딩
 *   // debouncedQuery → usePlaces에 전달
 */

import { useState, useEffect } from 'react'

export function useSearch(initialValue = '', delay = 350) {
  const [value, setValue] = useState(initialValue)
  const [debounced, setDebounced] = useState(initialValue)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return [value, setValue, debounced]
}
