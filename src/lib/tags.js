/**
 * tags.js
 * 태그 정적 상수
 * Supabase tags 테이블의 seed 데이터와 동일한 값을 유지합니다.
 * UI 필터, 폼 선택, 태그 탐색 페이지에서 공통 사용합니다.
 */

export const TAGS = [
  // 분위기
  { id: 't1',  slug: 'quiet',      name_ko: '조용한',        emoji: '🤫', type: 'mood' },
  { id: 't2',  slug: 'emotional',  name_ko: '감성적인',      emoji: '🌿', type: 'mood' },
  { id: 't3',  slug: 'vintage',    name_ko: '빈티지한',      emoji: '🪴', type: 'mood' },
  { id: 't4',  slug: 'modern',     name_ko: '모던한',        emoji: '🖤', type: 'mood' },
  { id: 't5',  slug: 'bright',     name_ko: '밝고 화사한',   emoji: '☀️', type: 'mood' },
  { id: 't6',  slug: 'cozy',       name_ko: '아늑한',        emoji: '🕯️', type: 'mood' },
  { id: 't7',  slug: 'instagram',  name_ko: '인스타감성',    emoji: '📸', type: 'mood' },
  { id: 't8',  slug: 'nature',     name_ko: '자연친화적',    emoji: '🌱', type: 'mood' },
  // 상황
  { id: 't9',  slug: 'date',       name_ko: '데이트',        emoji: '💑', type: 'situation' },
  { id: 't10', slug: 'solo',       name_ko: '혼자서',        emoji: '🎧', type: 'situation' },
  { id: 't11', slug: 'work',       name_ko: '작업·공부',     emoji: '💻', type: 'situation' },
  { id: 't12', slug: 'group',      name_ko: '친구 모임',     emoji: '👯', type: 'situation' },
  { id: 't13', slug: 'first-date', name_ko: '소개팅',        emoji: '🌸', type: 'situation' },
  { id: 't14', slug: 'special',    name_ko: '기념일',        emoji: '🎂', type: 'situation' },
  // 기타
  { id: 't15', slug: 'budget',     name_ko: '가성비',        emoji: '💸', type: 'other' },
  { id: 't16', slug: 'dessert',    name_ko: '디저트 맛집',   emoji: '🍰', type: 'other' },
  { id: 't17', slug: 'latenight',  name_ko: '늦게까지 운영', emoji: '🌙', type: 'other' },
]

/**
 * Supabase place_tags 조인 결과 또는 빈 배열을 반환합니다.
 * place.place_tags가 있으면 그것을 사용하고, 없으면 빈 배열입니다.
 * (sampleData 기반의 로컬 ID 조회는 더 이상 사용하지 않습니다.)
 */
export function getPlaceTags(place) {
  if (place.place_tags) {
    return place.place_tags.map(pt => pt.tags).filter(Boolean)
  }
  return []
}
