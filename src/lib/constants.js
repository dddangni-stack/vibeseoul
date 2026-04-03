/**
 * constants.js
 * 앱 전체에서 공유하는 상수값들을 모아둔 파일
 */

// 서울 주요 지역 목록
export const REGIONS = [
  '연남동', '홍대', '신촌', '혜화', '회기', '연희동',
  '이태원', '성수', '을지로', '망원동', '여의도',
  '경복궁', '동대문', '북촌', '강남', '압구정',
]

// 정렬 옵션
export const SORT_OPTIONS = [
  { value: 'latest',  label: '최신순' },
  { value: 'popular', label: '인기순' },
]

// 카테고리
export const CATEGORIES = [
  { value: 'cafe',       label: '카페' },
  { value: 'restaurant', label: '음식점' },
  { value: 'bar',        label: '바·술집' },
  { value: 'dessert',    label: '디저트' },
]

// 가격대 표시
export const PRICE_LABELS = {
  '₩':   '1만원 이하',
  '₩₩':  '1~2만원대',
  '₩₩₩': '3만원 이상',
}
