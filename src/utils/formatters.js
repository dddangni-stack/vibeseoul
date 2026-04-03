/**
 * formatters.js
 * 날짜, 숫자, 텍스트 포맷팅 헬퍼 함수 모음
 */

// 북마크 수 표시 (1000 이상은 K로 축약)
export function formatCount(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return String(n)
}

// 날짜를 한국어 형식으로 변환 (예: 2025년 1월 15일)
export function formatDateKo(dateStr) {
  const d = new Date(dateStr)
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
}

// 카테고리 slug → 한국어 레이블
export function getCategoryLabel(category) {
  const labels = {
    cafe:       '카페',
    restaurant: '음식점',
    bar:        '바·술집',
    dessert:    '디저트',
  }
  return labels[category] || category
}

// 가격대 설명 문자열
export function getPriceDescription(priceRange) {
  const desc = {
    '₩':   '1만원 이하',
    '₩₩':  '1~2만원대',
    '₩₩₩': '3만원 이상',
  }
  return desc[priceRange] || ''
}
