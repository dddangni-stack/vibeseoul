/**
 * LoginForm.jsx
 * 이메일 + 비밀번호 로그인 / 회원가입 폼
 *
 * - Supabase 모드: signInWithPassword / signUp
 * - 로컬 데모 모드: 이메일만 입력하면 바로 로그인
 */

import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { isSupabaseEnabled } from '../../lib/supabase'

export default function LoginForm({ onSuccess }) {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const { signIn, signUp } = useAuth()

  const isLogin = mode === 'login'

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim() || (!isSupabaseEnabled ? false : !password)) return

    setLoading(true)
    setError('')
    setMessage('')

    try {
      if (isLogin) {
        await signIn(email.trim().toLowerCase(), password)
        if (onSuccess) onSuccess()
      } else {
        await signUp(email.trim().toLowerCase(), password)
        if (isSupabaseEnabled) {
          setMessage('가입 완료! 이메일을 확인해 인증 링크를 클릭하면 로그인됩니다.')
        } else {
          if (onSuccess) onSuccess()
        }
      }
    } catch (err) {
      setError(translateError(err.message))
    } finally {
      setLoading(false)
    }
  }

  function switchMode() {
    setMode(prev => prev === 'login' ? 'signup' : 'login')
    setError('')
    setMessage('')
  }

  const canSubmit = email.trim() && (!isSupabaseEnabled || password.length >= 6)

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
          🌿 <strong>데모 모드</strong> — 이메일만 입력하면 바로 로그인됩니다.
        </div>
      )}

      {/* 이메일 */}
      <div style={{ marginBottom: '14px' }}>
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
          style={inputStyle}
          onFocus={e => { e.target.style.borderColor = '#C1714F' }}
          onBlur={e => { e.target.style.borderColor = '#EDE8E2' }}
        />
      </div>

      {/* 비밀번호 */}
      {isSupabaseEnabled && (
        <div style={{ marginBottom: '20px' }}>
          <label
            htmlFor="password"
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: '#2C2C2C',
              marginBottom: '8px',
            }}
          >
            비밀번호
            {!isLogin && (
              <span style={{ fontSize: '11px', fontWeight: 400, color: '#B5ADA3', marginLeft: '6px' }}>
                (6자 이상)
              </span>
            )}
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder={isLogin ? '비밀번호 입력' : '6자 이상 입력'}
            required
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = '#C1714F' }}
            onBlur={e => { e.target.style.borderColor = '#EDE8E2' }}
          />
        </div>
      )}

      {/* 에러 */}
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
        disabled={loading || !canSubmit}
        style={{
          width: '100%',
          padding: '13px',
          fontSize: '15px',
          fontWeight: 700,
          color: '#FAF8F5',
          backgroundColor: loading || !canSubmit ? '#B5ADA3' : '#2C2C2C',
          border: 'none',
          borderRadius: '10px',
          cursor: loading || !canSubmit ? 'not-allowed' : 'pointer',
          transition: 'background 0.15s',
          fontFamily: 'inherit',
        }}
      >
        {loading ? (isLogin ? '로그인 중...' : '가입 중...') : (isLogin ? '로그인' : '회원가입')}
      </button>

      {/* 모드 전환 */}
      <p style={{ textAlign: 'center', fontSize: '13px', color: '#8C8070', marginTop: '16px' }}>
        {isLogin ? '아직 계정이 없으신가요?' : '이미 계정이 있으신가요?'}
        {' '}
        <button
          type="button"
          onClick={switchMode}
          style={{
            background: 'none',
            border: 'none',
            color: '#C1714F',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer',
            padding: 0,
            fontFamily: 'inherit',
          }}
        >
          {isLogin ? '회원가입' : '로그인'}
        </button>
      </p>
    </form>
  )
}

const inputStyle = {
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
  fontFamily: 'inherit',
}

// Supabase 영문 에러 → 한국어 변환
function translateError(msg) {
  if (!msg) return '오류가 발생했습니다. 다시 시도해주세요.'
  if (msg.includes('Invalid login credentials')) return '이메일 또는 비밀번호가 올바르지 않습니다.'
  if (msg.includes('Email not confirmed')) return '이메일 인증이 필요합니다. 받은 편지함을 확인해주세요.'
  if (msg.includes('User already registered')) return '이미 가입된 이메일입니다. 로그인을 시도해보세요.'
  if (msg.includes('Password should be at least')) return '비밀번호는 6자 이상이어야 합니다.'
  if (msg.includes('Unable to validate email')) return '유효하지 않은 이메일 형식입니다.'
  if (msg.includes('rate limit')) return '잠시 후 다시 시도해주세요. (요청 제한 초과)'
  return msg
}
