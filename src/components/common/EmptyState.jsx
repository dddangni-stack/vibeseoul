/**
 * EmptyState.jsx
 * 데이터가 없을 때 표시하는 빈 상태 컴포넌트
 *
 * Props:
 *   - icon: string (이모지)
 *   - message: string
 *   - description: string (선택)
 *   - actionLabel: string (선택 - CTA 버튼 텍스트)
 *   - onAction: function (선택 - CTA 클릭 핸들러)
 */

export default function EmptyState({ icon = '🔍', message, description, actionLabel, onAction }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 20px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>{icon}</div>
      <p style={{ fontSize: '16px', fontWeight: 600, color: '#2C2C2C', marginBottom: '8px' }}>
        {message}
      </p>
      {description && (
        <p style={{ fontSize: '14px', color: '#8C8070', marginBottom: '24px' }}>
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          style={{
            backgroundColor: '#2C2C2C',
            color: '#FAF8F5',
            border: 'none',
            padding: '10px 24px',
            borderRadius: '100px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
