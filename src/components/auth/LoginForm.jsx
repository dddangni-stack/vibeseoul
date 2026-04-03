/**
 * LoginForm.jsx
 * 이메일 기반 로그인 폼 컴포넌트
 *
 * - Supabase 모드: 이메일 OTP (매직 링크) 로그인
 * - 로컬 데모 모드: 이메일만 입력하면 바로 로그인
 */

import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { isSupabaseEnabled } from '../../lib/supabase'

export default function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const { signIn } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    setError('')
    setMessage('')

    try {
      const result = await signIn(email.trim().toLowerCase())
      setMessage(result.message)
      if (!isSupabaseEnabled && onSuccess) {
        // 데모 모드: 즉시 리다이렉트
        setTimeout(onSuccess, 800)
      }
    } catch (err) {
      setError(err.message || '로그인 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px' }}>
      {/* 데모 모드 안내 */}
      {!isSupabaseEnabled && (
        <div
          style={{
            backgroundColor: '#FDF4E7',
            border: '1px solid #E8C99A',
            borderRadius: '10px',
            padding: '12px 16px',
            marginBottom: '20px',
            fontSize: '13px',
            color: '#8B5E3C',
            lineHeight: 1.5,
          }}
        >
          🌿 <strong>데모 모드</strong> — Supabase 없이 이메일만 입력하면 바로 로그인됩니다.
          실제 이메일을 사용하지 않아도 됩니다.
        </div>
      )}

      {/* 이메일 입력 */}
      <div style={{ marginBottom: '16px' }}>
        <label
          htmlFor="email"
          style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: 600,
            color: '#2C2C2C',
            marginBottom: '8px',
          }}
        >
          이메일
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="example@email.com"
          required
          style={{
            width: '100%',
            padding: '12px 16px',
            fontSize: '14px',
            color: '#2C2C2C',
            backgroundColor: '#fff',
            border: '1.5px solid #EDE8E2',
            borderRadius: '10px',
            outline: 'none',
            transition: 'border-color 0.15s',
            boxSizing: 'border-box',
          }}
          onFocus={e => { e.target.style.borderColor = '#C1714F' }}
          onBlur={e => { e.target.style.borderColor = '#EDE8E2' }}
        />
      </div>

      {/* 에러 메시지 */}
      {error && (
        <p style={{ fontSize: '13px', color: '#C1474F', marginBottom: '12px' }}>
          ⚠️ {error}
        </p>
      )}

      {/* 성공 메시지 */}
      {message && (
        <div
          style={{
            backgroundColor: '#F0FFF4',
            border: '1px solid #9AE6B4',
            borderRadius: '10px',
            padding: '12px 16px',
            marginBottom: '16px',
            fontSize: '13px',
            color: '#276749',
          }}
        >
          ✅ {message}
        </div>
      )}

      {/* 제출 버튼 */}
      <button
        type="submit"
        disabled={loading || !email.trim()}
        style={{
          width: '100%',
          padding: '13px',
          fontSize: '15px',
          fontWeight: 700,
          color: '#FAF8F5',
          backgroundColor: loading || !email.trim() ? '#B5ADA3' : '#2C2C2C',
          border: 'none',
          borderRadius: '10px',
          cursor: loading || !email.trim() ? 'not-allowed' : 'pointer',
          transition: 'background 0.15s',
          fontFamily: 'inherit',
        }}
      >
        {loading ? '로그인 중...' : isSupabaseEnabled ? '이메일 링크 받기' : '로그인'}
      </button>

      {/* Supabase 모드 안내 */}
      {isSupabaseEnabled && (
        <p style={{ fontSize: '12px', color: '#8C8070', textAlign: 'center', marginTop: '16px', lineHeight: 1.5 }}>
          입력한 이메일로 로그인 링크를 보내드립니다.<br />
          비밀번호 없이 링크 클릭 한 번으로 로그인됩니다.
        </p>
      )}
    </form>
  )
}
