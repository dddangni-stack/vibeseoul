/**
 * Spinner.jsx
 * 로딩 상태를 나타내는 스피너 컴포넌트
 */

export default function Spinner({ size = 36 }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          border: '3px solid #EDE8E2',
          borderTop: '3px solid #C1714F',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
