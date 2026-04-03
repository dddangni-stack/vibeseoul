/**
 * Badge.jsx
 * 지역명 등을 표시하는 작은 뱃지 컴포넌트
 *
 * Props:
 *   - children: ReactNode
 *   - variant: 'region' | 'category' | 'price'
 */

export default function Badge({ children, variant = 'region' }) {
  const styles = {
    region: {
      backgroundColor: '#F2EDE6',
      color: '#8C8070',
      border: '1px solid #E0D8CE',
    },
    category: {
      backgroundColor: '#FDF4E7',
      color: '#8B5E3C',
      border: '1px solid #E8C99A',
    },
    price: {
      backgroundColor: '#F0FFF4',
      color: '#276749',
      border: '1px solid #9AE6B4',
    },
  }

  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: '11px',
        fontWeight: 500,
        padding: '2px 8px',
        borderRadius: '100px',
        ...styles[variant],
      }}
    >
      {children}
    </span>
  )
}
