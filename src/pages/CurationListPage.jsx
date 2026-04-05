/**
 * CurationListPage.jsx
 * 큐레이션 목록 페이지
 * 에디터가 주제별로 엮은 장소 컬렉션을 카드 그리드로 보여줍니다.
 */

import { useState } from 'react'
import PageWrapper from '../components/layout/PageWrapper'
import CurationGrid from '../components/curation/CurationGrid'
import CurationFormModal from '../components/curation/CurationFormModal'
import { useCurations } from '../hooks/useCurations'
import { useAuth } from '../context/AuthContext'

export default function CurationListPage() {
  const { data: curations, loading } = useCurations()
  const { user } = useAuth()
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <PageWrapper>
      {/* 헤더 */}
      <div style={{ marginBottom: '40px' }}>
        <div
          style={{
            display: 'inline-block',
            fontSize: '12px',
            fontWeight: 600,
            color: '#C1714F',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            marginBottom: '10px',
          }}
        >
          ✨ Curation
        </div>
        <h1
          style={{
            fontSize: 'clamp(24px, 4vw, 32px)',
            fontWeight: 800,
            color: '#2C2C2C',
            letterSpacing: '-0.5px',
            marginBottom: '12px',
          }}
        >
          에디터가 직접 엮은<br />장소 컬렉션
        </h1>
        <p style={{ fontSize: '15px', color: '#8C8070', lineHeight: 1.6, maxWidth: '480px' }}>
          데이트 코스, 혼자만의 시간, 공부하기 좋은 카페까지—<br />
          주제별로 잘 어울리는 장소들을 모아 소개합니다.
        </p>
      </div>

      {/* 큐레이션 그리드 */}
      <CurationGrid curations={curations} loading={loading} />

      {/* FAB: 로그인한 사용자만 표시 */}
      {user && (
        <button
          onClick={() => setModalOpen(true)}
          style={{
            position: 'fixed',
            top: '96px',
            right: '24px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#2C2C2C',
            color: '#FAF8F5',
            fontSize: '26px',
            fontWeight: 300,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(44,44,44,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            lineHeight: 1,
          }}
          aria-label="큐레이션 추가"
        >
          +
        </button>
      )}

      <CurationFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={null}
      />
    </PageWrapper>
  )
}
