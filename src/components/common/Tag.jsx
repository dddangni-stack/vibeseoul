/**
 * Tag.jsx
 * 태그 칩 컴포넌트
 *
 * Props:
 *   - tag: { slug, name_ko, emoji, type }
 *   - active: boolean — 선택된 상태 (강조 표시)
 *   - onClick: function — 클릭 핸들러 (없으면 클릭 불가)
 *   - size: 'sm' | 'md'
 */

import { getTagColor } from '../../utils/tagColors'

export default function Tag({ tag, active = false, onClick, size = 'md' }) {
  const colors = getTagColor(tag.slug)

  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    borderRadius: '100px',
    fontWeight: active ? 600 : 500,
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap',
    border: '1px solid',
    userSelect: 'none',
    ...(size === 'sm'
      ? { fontSize: '11px', padding: '3px 10px' }
      : { fontSize: '12px', padding: '5px 12px' }),
    ...(active
      ? {
          backgroundColor: '#2C2C2C',
          color: '#FAF8F5',
          borderColor: '#2C2C2C',
        }
      : {
          backgroundColor: colors.bg,
          color: colors.text,
          borderColor: colors.border,
        }),
  }

  return (
    <span
      style={style}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter') onClick() } : undefined}
    >
      {tag.emoji && <span style={{ fontSize: size === 'sm' ? '10px' : '12px' }}>{tag.emoji}</span>}
      {tag.name_ko}
    </span>
  )
}
