/**
 * supabase.js
 * Supabase 클라이언트 싱글턴
 *
 * 사용 방법:
 * 1. Supabase 프로젝트 생성 후 .env.local에 키 입력
 * 2. 이 파일을 통해 클라이언트를 가져와 사용
 *
 * 현재는 로컬 샘플 데이터로 동작하며,
 * VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 환경 변수가 설정되면
 * 자동으로 Supabase에 연결됩니다.
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 환경 변수가 없으면 null을 반환 (각 훅에서 로컬 데이터 폴백)
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

// Supabase 연결 여부 확인 헬퍼
export const isSupabaseEnabled = Boolean(supabase)
