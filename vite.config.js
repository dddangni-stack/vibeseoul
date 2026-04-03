import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Vite 설정 파일
// - React 플러그인: JSX 변환 처리
// - Tailwind CSS v4: Vite 플러그인 방식으로 통합 (별도 postcss.config 불필요)
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': '/src', // import '@/components/...' 형태로 사용 가능
    },
  },
})
