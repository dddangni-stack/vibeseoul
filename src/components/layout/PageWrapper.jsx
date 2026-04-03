/**
 * PageWrapper.jsx
 * 페이지 콘텐츠의 최대 너비와 좌우 패딩을 일관되게 적용하는 래퍼
 *
 * Props:
 *   - children: ReactNode
 *   - className: string (추가 스타일)
 *   - noPadding: boolean (상하 패딩 제거, 풀블리드 섹션용)
 */

export default function PageWrapper({ children, noPadding = false }) {
  return (
    <main
      style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: noPadding ? '0 20px' : '40px 20px',
        width: '100%',
        flex: 1,
      }}
    >
      {children}
    </main>
  )
}
