/**
 * HeroBanner.jsx
 * 잡지 커버 스타일 히어로 배너
 *
 * DOLLY 잡지 커버에서 영감받은 레이아웃:
 * - 풀블리드 배경 이미지
 * - 커버라인 (작은 텍스트 박스)들이 이미지 위에 흩뿌려짐
 * - 굵은 피처 헤드라인
 * - 하단 티저 스트립
 */

import { Link } from 'react-router-dom'

export default function HeroBanner() {
  return (
    <div style={{ marginBottom: '0', position: 'relative' }}>

      {/* ══════════════════════════════════════
          MAGAZINE COVER — 메인 커버 영역
          ══════════════════════════════════════ */}
      <div
        style={{
          position: 'relative',
          height: 'clamp(480px, 80vw, 680px)',
          overflow: 'hidden',
          backgroundColor: '#1A1A1A',
        }}
      >
        {/* 배경 이미지 */}
        <img
          src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1400&q=85"
          alt="Vibe Seoul 커버"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            filter: 'brightness(0.78)',
          }}
        />

        {/* 오버레이 그라디언트 (좌우 + 하단) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              linear-gradient(to right, rgba(20,18,16,0.82) 0%, rgba(20,18,16,0.3) 45%, transparent 65%),
              linear-gradient(to top, rgba(20,18,16,0.7) 0%, transparent 40%)
            `,
          }}
        />

        {/* ── 커버라인 박스들 (우측 상단) ── */}
        <div
          style={{
            position: 'absolute',
            top: '28px',
            right: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            maxWidth: '200px',
          }}
        >
          <CoverLine
            accent="#C1714F"
            label="THIS WEEK"
            items={['혜화 데이트 코스', '홍대 감성 카페 5선']}
          />
          <CoverLine
            accent="#FAF8F5"
            label="인기 태그"
            items={['🤫 조용한', '🌿 감성적인', '🪴 빈티지한']}
          />
        </div>

        {/* ── 스티커: 인스타 뱃지 (우측 중간) ── */}
        <div
          style={{
            position: 'absolute',
            top: '42%',
            right: '28px',
            width: '80px',
            height: '80px',
            backgroundColor: '#C1714F',
            borderRadius: '50%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            transform: 'rotate(12deg)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}
        >
          <span style={{ fontSize: '18px' }}>✦</span>
          <span style={{ fontSize: '9px', fontWeight: 800, color: '#FAF8F5', letterSpacing: '0.5px', lineHeight: 1.2 }}>
            FREE<br/>ISSUE
          </span>
        </div>

        {/* ── 메인 헤드라인 텍스트 (좌측) ── */}
        <div
          style={{
            position: 'absolute',
            left: 'clamp(20px, 5vw, 56px)',
            top: '50%',
            transform: 'translateY(-55%)',
            maxWidth: 'clamp(260px, 45%, 480px)',
          }}
        >
          {/* 서브 라벨 */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '14px',
            }}
          >
            <div style={{ width: '24px', height: '2px', backgroundColor: '#C1714F' }} />
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#C1714F',
                letterSpacing: '2.5px',
                textTransform: 'uppercase',
              }}
            >
              Feature Story
            </span>
          </div>

          {/* 메인 헤드라인 */}
          <h1
            style={{
              fontSize: 'clamp(32px, 6vw, 62px)',
              fontWeight: 900,
              color: '#FAF8F5',
              lineHeight: 1.05,
              letterSpacing: '-1.5px',
              marginBottom: '16px',
              fontStyle: 'italic',
            }}
          >
            지금,<br />
            <span style={{ color: '#C1714F' }}>이 분위기</span>가<br />
            필요해요
          </h1>

          {/* 덱 텍스트 */}
          <p
            style={{
              fontSize: 'clamp(12px, 1.6vw, 15px)',
              color: 'rgba(250,248,245,0.75)',
              lineHeight: 1.7,
              marginBottom: '28px',
              maxWidth: '320px',
            }}
          >
            별점 대신 감성으로 — 서울의 카페와 맛집을<br />
            분위기와 상황 중심으로 발견합니다.
          </p>

          {/* CTA 버튼 */}
          <Link
            to="/places"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#FAF8F5',
              color: '#2C2C2C',
              fontWeight: 800,
              fontSize: '12px',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              padding: '12px 22px',
              textDecoration: 'none',
              border: '2px solid #FAF8F5',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#FAF8F5'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#FAF8F5'
              e.currentTarget.style.color = '#2C2C2C'
            }}
          >
            장소 탐색하기
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* ── 하단 좌측: 장소 수 카운터 ── */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            left: 'clamp(20px, 5vw, 56px)',
          }}
        >
          <span
            style={{
              fontSize: 'clamp(36px, 6vw, 56px)',
              fontWeight: 900,
              color: '#FAF8F5',
              letterSpacing: '-2px',
              lineHeight: 1,
              fontStyle: 'italic',
            }}
          >
            15+
          </span>
          <span
            style={{
              fontSize: 'clamp(12px, 1.5vw, 15px)',
              color: 'rgba(250,248,245,0.7)',
              marginLeft: '10px',
              fontWeight: 500,
            }}
          >
            서울 감성 장소
          </span>
        </div>

        {/* ── 하단 우측: 이슈 날짜 ── */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            right: '24px',
            textAlign: 'right',
          }}
        >
          <div style={{ fontSize: '10px', color: 'rgba(250,248,245,0.5)', letterSpacing: '1px', textTransform: 'uppercase' }}>
            2025 · SEOUL EDITION
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          티저 스트립 — 잡지 하단 커버라인 바
          ══════════════════════════════════════ */}
      <div
        style={{
          backgroundColor: '#2C2C2C',
          padding: '0',
          display: 'flex',
          overflowX: 'auto',
        }}
        className="scrollbar-hide"
      >
        {[
          { emoji: '💑', text: '데이트 코스 추천', link: '/places?tag=date' },
          { emoji: '💻', text: '과제하기 좋은 카페', link: '/places?tag=work' },
          { emoji: '🎧', text: '혼자 가기 좋은 곳', link: '/places?tag=solo' },
          { emoji: '✨', text: '에디터 큐레이션', link: '/curations' },
          { emoji: '🔥', text: '지금 인기 있는 곳', link: '/places?sort=popular' },
        ].map((item, i) => (
          <Link
            key={i}
            to={item.link}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              borderRight: '1px solid #3C3C3C',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#3C3C3C' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <span style={{ fontSize: '14px' }}>{item.emoji}</span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#FAF8F5', letterSpacing: '0.3px' }}>
              {item.text}
            </span>
          </Link>
        ))}
      </div>

    </div>
  )
}

/* 잡지 커버라인 박스 컴포넌트 */
function CoverLine({ label, items, accent = '#C1714F' }) {
  return (
    <div
      style={{
        backgroundColor: 'rgba(250, 248, 245, 0.92)',
        backdropFilter: 'blur(8px)',
        padding: '10px 12px',
        borderLeft: `3px solid ${accent}`,
      }}
    >
      <div
        style={{
          fontSize: '9px',
          fontWeight: 800,
          color: accent,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          marginBottom: '6px',
        }}
      >
        {label}
      </div>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#2C2C2C',
            lineHeight: 1.5,
            paddingLeft: '8px',
            position: 'relative',
          }}
        >
          <span
            style={{
              position: 'absolute',
              left: 0,
              color: accent,
              fontSize: '8px',
              top: '3px',
            }}
          >
            ▸
          </span>
          {item}
        </div>
      ))}
    </div>
  )
}
