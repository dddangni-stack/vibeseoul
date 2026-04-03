/**
 * tagColors.js
 * 태그 slug → 배경색 + 텍스트색 클래스 맵
 * Tailwind의 JIT 방식은 동적 클래스 생성을 지원하지 않으므로
 * 전체 클래스 문자열을 명시적으로 정의해야 합니다.
 */

export const TAG_COLORS = {
  // 분위기 태그
  quiet:     { bg: '#EEF2F7', text: '#4A6FA5', border: '#C5D5E8' },
  emotional: { bg: '#F0F7F0', text: '#3D7A4A', border: '#B8D8BA' },
  vintage:   { bg: '#FDF4E7', text: '#8B5E3C', border: '#E8C99A' },
  modern:    { bg: '#F2F2F2', text: '#3C3C3C', border: '#CCCCCC' },
  bright:    { bg: '#FFFBEB', text: '#8B7000', border: '#F0D678' },
  cozy:      { bg: '#FDF0EF', text: '#9B4D46', border: '#F0C4C1' },
  instagram: { bg: '#FDF0F7', text: '#8B3A6B', border: '#F0C0DC' },
  nature:    { bg: '#EDFAF1', text: '#2D6A4F', border: '#A8DABC' },
  // 상황 태그
  date:        { bg: '#FFF0F3', text: '#C1476E', border: '#F8BDD1' },
  solo:        { bg: '#F3F0FF', text: '#6B5CC8', border: '#C9C0F0' },
  work:        { bg: '#EFF6FF', text: '#1D5A9B', border: '#BAD5F8' },
  group:       { bg: '#FFF3E0', text: '#8B5A00', border: '#FFD08A' },
  'first-date':{ bg: '#FFF0F7', text: '#A63975', border: '#FACBE5' },
  special:     { bg: '#FFF8E1', text: '#8B6500', border: '#F8D980' },
  // 기타 태그
  budget:    { bg: '#F0FFF4', text: '#276749', border: '#9AE6B4' },
  dessert:   { bg: '#FFF5F7', text: '#9B2C5A', border: '#FEB2CC' },
  latenight: { bg: '#EEF2FF', text: '#4338CA', border: '#C7D2FE' },
  // 기본값 (알 수 없는 slug)
  default:   { bg: '#F5F0EB', text: '#6B5E52', border: '#D9CBC0' },
}

/**
 * 태그 slug에 해당하는 색상 객체를 반환합니다.
 * @param {string} slug
 * @returns {{ bg: string, text: string, border: string }}
 */
export function getTagColor(slug) {
  return TAG_COLORS[slug] || TAG_COLORS.default
}
