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

  // 이메일 매직 링크 로그인 (Supabase)
  // 로컬 모드에서는 이메일만으로 바로 로그인 처리
  async function signIn(email) {
    if (supabase) {
      const { error } = await supabase.auth.signInWithOtp({ email })
      if (error) throw error
      return { message: '이메일을 확인하세요! 로그인 링크를 보내드렸습니다.' }
    } else {
      // 로컬 데모 모드: 이메일을 그대로 사용자로 저장
      const u = { id: 'local-user', email, created_at: new Date().toISOString() }
      localStorage.setItem('vibe_seoul_user', JSON.stringify(u))
      setUser(u)
      setSession({ user: u })
      return { message: '데모 모드: 로그인되었습니다.' }
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

  const value = { session, user, loading, signIn, signOut }

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
