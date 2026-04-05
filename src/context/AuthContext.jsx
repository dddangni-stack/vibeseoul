/**
 * AuthContext.jsx
 * 전역 인증 상태 관리 컨텍스트
 *
 * - 앱 전체에서 로그인 상태를 공유합니다.
 * - Supabase auth.onAuthStateChange를 구독하여 세션 변화를 감지합니다.
 * - Supabase 미연결 상태에서는 로컬 세션(localStorage)을 시뮬레이션합니다.
 *
 * 사용법:
 *   const { user, session, signIn, signOut, loading } = useAuth()
 */

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (supabase) {
      // ── Supabase 연결된 경우: 실제 세션 구독 ──
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      })

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session)
          setUser(session?.user ?? null)
          setLoading(false)
        }
      )

      return () => subscription.unsubscribe()
    } else {
      // ── 로컬 모드: localStorage에서 세션 복원 ──
      const stored = localStorage.getItem('vibe_seoul_user')
      if (stored) {
        const u = JSON.parse(stored)
        setUser(u)
        setSession({ user: u })
      }
      setLoading(false)
    }
  }, [])

  // 이메일 + 비밀번호 로그인
  async function signIn(email, password) {
    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
    } else {
      // 로컬 데모 모드
      const u = { id: 'local-user', email, created_at: new Date().toISOString() }
      localStorage.setItem('vibe_seoul_user', JSON.stringify(u))
      setUser(u)
      setSession({ user: u })
    }
  }

  // 이메일 + 비밀번호 회원가입
  async function signUp(email, password) {
    if (supabase) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
    } else {
      // 로컬 데모 모드: 가입 즉시 로그인
      const u = { id: 'local-user', email, created_at: new Date().toISOString() }
      localStorage.setItem('vibe_seoul_user', JSON.stringify(u))
      setUser(u)
      setSession({ user: u })
    }
  }

  async function signOut() {
    if (supabase) {
      await supabase.auth.signOut()
    } else {
      localStorage.removeItem('vibe_seoul_user')
      localStorage.removeItem('vibe_seoul_bookmarks')
    }
    setUser(null)
    setSession(null)
  }

  const value = { session, user, loading, signIn, signUp, signOut }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// 커스텀 훅: AuthContext를 쉽게 사용하기 위한 래퍼
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth는 AuthProvider 내부에서 사용해야 합니다.')
  return ctx
}
